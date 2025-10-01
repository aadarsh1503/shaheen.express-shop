// server/controllers/authController.js (REFACTORED WITH ASYNC/AWAIT)

import pool from '../config/db.js'; // Import the pool we created
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

        // Step 1: Check if the user already exists
        const [existingUsers] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Step 2: Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Step 3: Insert the new user into the database
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        
        res.status(201).json({ 
            message: 'User registered successfully!',
            userId: result.insertId 
        });

    } catch (err) {
        console.error('Signup Error:', err);
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
        
        // Step 1: Find the user by email
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Step 2: Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Step 3: Create and sign a JWT token
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '90d' });

        res.json({ token });

    } catch (err) {
        console.error('Login Error:', err);
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
        console.error('Get User Info Error:', err);
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
            // SCENARIO 1: User is changing their password
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
            // SCENARIO 2: User is NOT changing their password
            await pool.query(
                'UPDATE users SET first_name = ?, last_name = ?, name = ? WHERE id = ?',
                [firstName, lastName, displayName, userId]
            );
        }

        // Fetch and send back the updated user profile
        const [updatedUser] = await pool.query(
            'SELECT id, name, email, first_name AS firstName, last_name AS lastName FROM users WHERE id = ?',
            [userId]
        );

        res.status(200).json(updatedUser[0]);

    } catch (err) {
        console.error('Update User Info Error:', err);
        res.status(500).json({ message: 'Server error during profile update.' });
    }
};


// --- FORGOT PASSWORD FUNCTION ---
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        // For security, always send a success message, even if user doesn't exist.
        if (users.length === 0) {
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        const user = users[0];
        const resetToken = crypto.randomBytes(20).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await pool.query(
            'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
            [hashedToken, tokenExpiry, user.id]
        );

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const message = `... your email HTML here ... <a href="${resetURL}">${resetURL}</a> ...`;

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message
        });

        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (err) {
        console.error('Forgot Password Error:', err);
        // Clear token if email sending fails to allow user to retry
        // Note: This part needs the user's ID, which we may not have if the initial query failed.
        // For simplicity, we just log the error. In a real app, you'd handle this more gracefully.
        res.status(500).json({ message: "An error occurred. Please try again later." });
    }
};

// --- RESET PASSWORD FUNCTION ---
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

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

        res.status(200).json({ message: 'Password has been reset successfully!' });

    } catch (err) {
        console.error('Reset Password Error:', err);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
};