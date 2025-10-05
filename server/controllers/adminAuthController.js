// controllers/adminController.js (REFACTORED WITH ASYNC/AWAIT)

import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
