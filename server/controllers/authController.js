import pool from '../config/db.js'; // Your db connection is now called 'pool', but it's a single connection. Let's keep the name for consistency.
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Import crypto for token generation
import sendEmail from '../utils/sendEmail.js'; // Import our email utility
// --- SIGNUP FUNCTION using Callbacks ---
export const signup = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Step 1: Check if the user already exists
    pool.query('SELECT email FROM users WHERE email = ?', [email], (err, existingUsers) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Step 2: If user does not exist, hash the password
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error generating salt' });
            }

            bcrypt.hash(password, salt, (err, hashedPassword) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error hashing password' });
                }

                // Step 3: Insert the new user into the database
                pool.query(
                    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                    [name, email, hashedPassword],
                    (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ message: 'Database error on user creation' });
                        }
                        
                        // Success!
                        res.status(201).json({ 
                            message: 'User registered successfully!',
                            userId: result.insertId 
                        });
                    }
                );
            });
        });
    });
};

// --- LOGIN FUNCTION using Callbacks ---
export const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    
    // Step 1: Find the user by email
    pool.query('SELECT * FROM users WHERE email = ?', [email], (err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Step 2: Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Step 3: If passwords match, create and sign a JWT token
            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '90d' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        });
    });
};

export const getUserInfo = (req, res) => {
    pool.query(
        // Use AS to rename snake_case columns to camelCase for the frontend
        'SELECT id, name, email, first_name AS firstName, last_name AS lastName FROM users WHERE id = ?',
        [req.userId],
        (err, results) => {
            if (err) {
                console.error("DB error in getUserInfo:", err);
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(results[0]);
        }
    );
};

// 2. ADD A NEW FUNCTION for updating the user profile
export const updateUserInfo = (req, res) => {
    const userId = req.userId;
    const { firstName, lastName, displayName, currentPassword, newPassword } = req.body;

    // Basic validation for name fields
    if (!firstName || !lastName || !displayName) {
        return res.status(400).json({ message: 'First name, last name, and display name are required.' });
    }

    // --- SCENARIO 1: User wants to change their password ---
    if (currentPassword && newPassword) {
        // Step 1: Get the current user from DB to verify the old password
        pool.query('SELECT * FROM users WHERE id = ?', [userId], (err, users) => {
            if (err || users.length === 0) {
                return res.status(500).json({ message: 'Error finding user or user not found.' });
            }

            const user = users[0];

            // Step 2: Compare the provided current password with the stored hash
            bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ message: 'Error comparing passwords.' });
                }

                if (!isMatch) {
                    // If passwords do not match, send an error
                    return res.status(401).json({ message: 'Incorrect current password.' });
                }

                // Step 3: If passwords match, hash the new password
                bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error hashing new password.' });
                    }

                    // Step 4: Update everything in the database
                    pool.query(
                        'UPDATE users SET first_name = ?, last_name = ?, name = ?, password = ? WHERE id = ?',
                        [firstName, lastName, displayName, hashedPassword, userId],
                        (err, result) => {
                            if (err) {
                                return res.status(500).json({ message: 'Database error on update.' });
                            }
                            // Call a helper function to send back the updated user data
                            sendUpdatedUser(res, userId);
                        }
                    );
                });
            });
        });
    } else {
        // --- SCENARIO 2: User is NOT changing their password ---
        // Just update the name fields
        pool.query(
            'UPDATE users SET first_name = ?, last_name = ?, name = ? WHERE id = ?',
            [firstName, lastName, displayName, userId],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error on update.' });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }
                // Call a helper function to send back the updated user data
                sendUpdatedUser(res, userId);
            }
        );
    }
};

// Helper function to avoid repeating code. It fetches and sends the updated user profile.
const sendUpdatedUser = (res, userId) => {
    pool.query(
        'SELECT id, name, email, first_name AS firstName, last_name AS lastName FROM users WHERE id = ?',
        [userId],
        (err, users) => {
            if (err || users.length === 0) {
                return res.status(200).json({ message: "Profile updated successfully, but failed to fetch latest data." });
            }
            res.status(200).json(users[0]); // Send back the complete, updated user object
        }
    );
};
export const forgotPassword = (req, res) => {
    const { email } = req.body;
    console.log(`\n--- Forgot Password Request Received for: ${email} ---`);

    // 1. Find the user by email
    pool.query('SELECT * FROM users WHERE email = ?', [email], (err, users) => {
        // IMPORTANT: For security, always send the same success message, 
        // whether the user exists or not. This prevents email enumeration attacks.
        if (err || users.length === 0) {
            console.log("LOG: User not found or DB error. Sending generic success message for security.");
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }
        
        const user = users[0];
        console.log(`LOG: User found: ID ${user.id}`);

        // 2. Generate a random reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // 3. Hash the token and set an expiry date (e.g., 1 hour)
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        // 4. Save the hashed token and expiry to the user's record in the database
        pool.query(
            'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
            [hashedToken, tokenExpiry, user.id],
            async (err, result) => {
                if (err) {
                    console.error("ERROR: DB error updating user with reset token:", err);
                    return res.status(500).json({ message: "An error occurred. Please try again later." });
                }

                console.log("LOG: User DB updated with token. Preparing to send email.");

                try {
                    // 5. Create the reset URL for the email
                    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
                    console.log(`LOG: Reset URL created: ${resetURL}`);
                    
                    const message = `
                        <h1>You have requested a password reset</h1>
                        <p>Please click on the following link, or paste it into your browser to complete the process:</p>
                        <p><a href="${resetURL}">${resetURL}</a></p>
                        <p>This link is valid for 1 hour.</p>
                        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    `;

                    console.log("LOG: Attempting to send email via sendEmail utility...");

                    // 6. Send the email
                    await sendEmail({
                        email: user.email,
                        subject: 'Password Reset Request',
                        message
                    });

                    console.log("LOG: Email sent successfully.");
                    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
                
                } catch (emailError) {
                    console.error("FATAL ERROR: Email sending failed!", emailError);
                    // If email fails, clear the token from the DB to allow user to try again
                    pool.query('UPDATE users SET reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?', [user.id]);
                    return res.status(500).json({ message: "There was an error sending the email. Please try again." });
                }
            }
        );
    });
};

// --- RESET PASSWORD CONTROLLER ---
export const resetPassword = (req, res) => {
    // 1. Get the raw token from the URL parameters
    const resetToken = req.params.token;
    
    // 2. Hash it to match the one stored in the DB
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // 3. Find the user with a matching, non-expired token
    pool.query(
        // Use NOW() to check if the expiry date is in the future
        'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
        [hashedToken],
        (err, users) => {
            if (err || users.length === 0) {
                return res.status(400).json({ message: 'Token is invalid or has expired.' });
            }

            const user = users[0];
            const { password } = req.body;

            // 4. Hash the new password
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ message: 'Error hashing new password.' });
                }

                // 5. Update the user's password and clear the reset token fields
                pool.query(
                    'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
                    [hashedPassword, user.id],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error updating password.' });
                        }
                        res.status(200).json({ message: 'Password has been reset successfully!' });
                    }
                );
            });
        }
    );
};