import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- ADMIN SIGNUP using Callbacks ---
export const adminSignup = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Step 1: Check if the admin already exists
    pool.query('SELECT email FROM admins WHERE email = ?', [email], (err, existingAdmins) => {
        if (err) {
            console.error('Database error during admin check:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (existingAdmins.length > 0) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        // Step 2: Hash the password
        bcrypt.genSalt(10, (saltErr, salt) => {
            if (saltErr) {
                console.error('Salt generation error:', saltErr);
                return res.status(500).json({ message: 'Server error' });
            }

            bcrypt.hash(password, salt, (hashErr, hashedPassword) => {
                if (hashErr) {
                    console.error('Password hashing error:', hashErr);
                    return res.status(500).json({ message: 'Server error' });
                }

                // Step 3: Insert the new admin into the database
                pool.query(
                    'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
                    [name, email, hashedPassword],
                    (insertErr, result) => {
                        if (insertErr) {
                            console.error('Database error on admin creation:', insertErr);
                            return res.status(500).json({ message: 'Server error' });
                        }
                        
                        // Success!
                        res.status(201).json({ 
                            message: 'Admin registered successfully!',
                            adminId: result.insertId 
                        });
                    }
                );
            });
        });
    });
};

// --- ADMIN LOGIN using Callbacks ---
export const adminLogin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    
    // Step 1: Find the admin by email
    pool.query('SELECT * FROM admins WHERE email = ?', [email], (err, admins) => {
        if (err) {
            console.error('Database error during admin login:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (admins.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const admin = admins[0];

        // Step 2: Compare the provided password with the stored hash
        bcrypt.compare(password, admin.password, (compareErr, isMatch) => {
            if (compareErr) {
                console.error('Password comparison error:', compareErr);
                return res.status(500).json({ message: 'Server error' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Step 3: If passwords match, create and sign a JWT token
            const payload = {
                user: {
                    id: admin.id,
                    role: 'admin' // IMPORTANT: We add a role here
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET2, 
                { expiresIn: '1d' },
                (jwtErr, token) => {
                    if (jwtErr) {
                        console.error('JWT signing error:', jwtErr);
                        return res.status(500).json({ message: 'Server error' });
                    }
                    res.json({ token });
                }
            );
        });
    });
};