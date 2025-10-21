// controllers/adminController.js (REFACTORED WITH ASYNC/AWAIT)

import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; 
import sendEmail from '../utils/sendEmail.js'; 

// --- ADMIN SIGNUP ---
export const adminSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Step 1: Check if the admin already exists
        const [existingAdmins] = await pool.query('SELECT email FROM admins WHERE email = ?', [email]);

        if (existingAdmins.length > 0) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        // Step 2: Hash the password (bcrypt functions also support promises/await)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Step 3: Insert the new admin into the database
        const [result] = await pool.query(
            'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        
        res.status(201).json({ 
            message: 'Admin registered successfully!',
            adminId: result.insertId 
        });

    } catch (err) {
        console.error('Admin Signup Error:', err);
        res.status(500).json({ message: 'Server error during admin registration' });
    }
};

// --- ADMIN LOGIN ---
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🟢 Admin Login Attempt:', { email });

        if (!email || !password) {
            console.log('⚠️ Missing fields:', { email, passwordProvided: !!password });
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        
        // Step 1: Find the admin by email
        const [admins] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
        console.log('📄 Admins found:', admins.length);

        if (admins.length === 0) {
            console.log('❌ No admin found with email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const admin = admins[0];
        console.log('✅ Admin record found:', { id: admin.id, email: admin.email });

        // Step 2: Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log('🔐 Password match result:', isMatch);

        if (!isMatch) {
            console.log('❌ Invalid password for admin:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Step 3: If passwords match, create and sign a JWT token
        const payload = {
            user: {
                id: admin.id,
                role: 'admin'
            },
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET2,
            { expiresIn: '1d' }
        );

        console.log('🎫 JWT Token created successfully for admin ID:', admin.id);

        res.json({ token });

    } catch (err) {
        console.error('🔥 Admin Login Error:', err);
        res.status(500).json({ message: 'Server error during admin login' });
    }
};
const createAdminPasswordResetEmail = (adminName, resetURL) => {
    const brandColor = '#007bff'; // Admin panel blue
    const logoURL = 'https://shaheen.express/assets/i1-3Ew8TKSD.png'; // Or an admin-specific logo

    return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border: 1px solid #dddddd;">
            <tr>
                <td align="center" style="padding: 20px 0; background-color: #343a40; color: #ffffff;">
                    <img src="${logoURL}" alt="Logo" width="150" style="display: block;" />
                    <h1 style="margin: 10px 0 0;">Admin Panel Password Reset</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 40px 30px;">
                    <h2 style="color: #333333;">Hello, ${adminName}!</h2>
                    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                        We received a request to reset the password for your admin account. To proceed, please click the button below.
                    </p>
                    <p style="color: ${brandColor}; font-weight: bold;">This link is only valid for 10 minutes.</p>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="center" style="padding: 20px 0;">
                                <a href="${resetURL}" style="background-color: ${brandColor}; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                    Reset Your Password
                                </a>
                            </td>
                        </tr>
                    </table>
                    <p style="color: #555555; font-size: 16px;">
                        If you did not request a password reset, you can safely ignore this email. Your password will not be changed.
                    </p>
                    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #888888;">
                        If the button doesn't work, copy and paste this URL into your browser:<br>
                        <a href="${resetURL}" style="color: ${brandColor}; word-break: break-all;">${resetURL}</a>
                    </p>
                </td>
            </tr>
            <tr>
                <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center;">
                    <p style="margin: 0; color: #888888; font-size: 12px;">Thank you, <br/> The Shaheen Express Team</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};


// --- [NEW] ADMIN FORGOT PASSWORD ---
export const adminForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const [admins] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
        
        if (admins.length === 0) {
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }
        const admin = admins[0];

        // This line was failing because 'crypto' was not defined
        const resetToken = crypto.randomBytes(20).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query(
            'UPDATE admins SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
            [hashedToken, tokenExpiry, admin.id]
        );

        // Correctly form the reset URL
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const resetURL = `${clientUrl}/admin/reset-password/${resetToken}`;

        const emailHtml = createAdminPasswordResetEmail(admin.name, resetURL);
        await sendEmail({
            email: admin.email,
            subject: 'Admin Password Reset Request',
            message: emailHtml
        });

        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (err) {
        console.error("Admin Forgot Password Error:", err);
        const { email } = req.body;
        // The user might not exist, so we only try to nullify the token if an email was provided
        if (email) {
            try {
                await pool.query('UPDATE admins SET reset_password_token = NULL, reset_password_expires = NULL WHERE email = ?', [email]);
            } catch (cleanupError) {
                console.error("Failed to cleanup token on error:", cleanupError);
            }
        }
        res.status(500).json({ message: "An error occurred. Please try again later." });
    }
};

// --- [NEW] ADMIN RESET PASSWORD ---
export const adminResetPassword = async (req, res) => {
    try {
        const resetToken = req.params.token;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'New password is required.' });
        }

        // This line also depends on the 'crypto' import
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const [admins] = await pool.query(
            'SELECT * FROM admins WHERE reset_password_token = ? AND reset_password_expires > NOW()',
            [hashedToken]
        );

        if (admins.length === 0) {
            return res.status(400).json({ message: 'Token is invalid or has expired.' });
        }
        const admin = admins[0];

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            'UPDATE admins SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
            [hashedPassword, admin.id]
        );

        res.status(200).json({ message: 'Password has been reset successfully!' });

    } catch (err) {
        console.error("Admin Reset Password Error:", err);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
};