// server/controllers/authController.js (FINAL REVISION)

import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

// --- SIGNUP FUNCTION ---
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const [existingUsers] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        
        res.status(201).json({ 
            message: 'User registered successfully!',
            userId: result.insertId 
        });

    } catch (err) {
        // In production, you might want a more sophisticated logger here
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// --- LOGIN FUNCTION ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '90d' });

        res.json({ token });

    } catch (err) {
        res.status(500).json({ message: 'Server error during login' });
    }
};

// --- GET USER INFO FUNCTION ---
export const getUserInfo = async (req, res) => {
    try {
        const [results] = await pool.query(
            'SELECT id, name, email, first_name AS firstName, last_name AS lastName FROM users WHERE id = ?',
            [req.userId]
        );
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(results[0]);

    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
};

// --- UPDATE USER INFO FUNCTION ---
export const updateUserInfo = async (req, res) => {
    try {
        const userId = req.userId;
        const { firstName, lastName, displayName, currentPassword, newPassword } = req.body;

        if (!firstName || !lastName || !displayName) {
            return res.status(400).json({ message: 'First name, last name, and display name are required.' });
        }

        if (currentPassword && newPassword) {
            const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
            if (users.length === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }
            const user = users[0];

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect current password.' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await pool.query(
                'UPDATE users SET first_name = ?, last_name = ?, name = ?, password = ? WHERE id = ?',
                [firstName, lastName, displayName, hashedPassword, userId]
            );

        } else {
            await pool.query(
                'UPDATE users SET first_name = ?, last_name = ?, name = ? WHERE id = ?',
                [firstName, lastName, displayName, userId]
            );
        }

        const [updatedUser] = await pool.query(
            'SELECT id, name, email, first_name AS firstName, last_name AS lastName FROM users WHERE id = ?',
            [userId]
        );

        res.status(200).json(updatedUser[0]);

    } catch (err) {
        res.status(500).json({ message: 'Server error during profile update.' });
    }
};

// --- [UPGRADED] HELPER FUNCTION FOR CREATING THE BRANDED HTML EMAIL ---
const createPasswordResetEmail = (userName, resetURL) => {
    const brandColor = '#E32126';
    const logoURL = 'https://shaheen--express.vercel.app/assets/i1-3Ew8TKSD.png';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin-top: 20px; background-color: #ffffff; border: 1px solid #dddddd;">
            <tr>
                <td align="center" style="padding: 20px 0 20px 0; background-color: #000000;">
                    <img src="${logoURL}" alt="Shaheen Express Logo" width="180" style="display: block;" />
                </td>
            </tr>
            <tr>
                <td style="padding: 40px 30px 40px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="color: #153643; font-size: 24px;">
                                <b>Hello, ${userName}!</b>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 0 30px 0; color: #153643; font-size: 16px; line-height: 24px;">
                                We received a request to reset your password. To proceed, please click the button below.
                                <br><br>
                                <b style="color: ${brandColor};">This link is only valid for 5 minutes.</b>
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${resetURL}" style="height:50px;v-text-anchor:middle;width:290px;" arcsize="10%" strokecolor="${brandColor}" fillcolor="${brandColor}">
                                    <w:anchorlock/>
                                    <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:18px;font-weight:bold;">
                                        Reset Your Password
                                    </center>
                                </v:roundrect>
                                <![endif]-->
                                <!--[if !mso]><!-->
                                <a href="${resetURL}" style="background-color: ${brandColor}; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 18px; font-weight: bold;">
                                    Reset Your Password
                                </a>
                                <!--<![endif]-->
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px 0 10px 0; color: #153643; font-size: 16px; line-height: 24px;">
                                If you did not request a password reset, you can safely ignore this email. Your password will not be changed.
                            </td>
                        </tr>
                         <tr>
                            <td style="padding: 20px 0 0 0; font-size: 12px; color: #888888;">
                                If the button above doesn't work, copy and paste this URL into your browser:<br>
                                <a href="${resetURL}" style="color: ${brandColor}; word-break: break-all;">${resetURL}</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="background-color: #f9f9f9; padding: 20px 30px;">
                    <p style="margin: 0; color: #888888; font-size: 12px;">Thank you, <br/> The Shaheen Express Team</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};


// --- FORGOT PASSWORD FUNCTION (UPDATED & CLEANED) ---
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            // For security, always send a success message, even if user doesn't exist.
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        const user = users[0];

        const resetToken = crypto.randomBytes(20).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const tokenExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await pool.query(
            'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
            [hashedToken, tokenExpiry, user.id]
        );

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const emailHtml = createPasswordResetEmail(user.name, resetURL);

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message: emailHtml 
        });

        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (err) {
        // Log the error internally but send a generic message to the user
        res.status(500).json({ message: "An error occurred. Please try again later." });
    }
};

// --- RESET PASSWORD FUNCTION (CLEANED) ---
export const resetPassword = async (req, res) => {
    try {
        const resetToken = req.params.token;
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const [users] = await pool.query(
            'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
            [hashedToken]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'Token is invalid or has expired.' });
        }

        const user = users[0];
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password is required.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

        res.status(200).json({ message: 'Password has been reset successfully!' });

    } catch (err) {
        res.status(500).json({ message: 'Server error during password reset.' });
    }
};