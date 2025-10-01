// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { forgotPassword } from '../frontend-admin/services/api';
// --- NEW IMPORTS ---
// Framer Motion for animations
import { motion, AnimatePresence } from 'framer-motion';
// Ant Design Icons for a sleek, modern look
import { MailOutlined, LockOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import "./f.css"
// Animation variants for our motion components
const containerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
            duration: 0.7, 
            ease: "easeOut" 
        } 
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};


const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');
        try {
            // Simulate network delay to see the loader
            await new Promise(resolve => setTimeout(resolve, 1000));
            const res = await forgotPassword(email);
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        // A subtle, sexy gradient background that animates
        <div className="min-h-screen mt-20 bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4 font-sans">
            
            {/* Main container with an entry animation */}
            <motion.div 
                className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="text-center mb-10">
                    <LockOutlined className="text-5xl text-gray-400 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Lost Your Way?
                    </h1>
                    <p className="text-gray-500">
                        No problem. Enter your email and we'll send you a reset link.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {message ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 bg-green-50 border border-green-200 text-green-800 rounded-lg text-center flex flex-col items-center"
                        >
                            <CheckCircleOutlined className="w-12 h-12 mb-4 text-4xl text-green-500" />
                            <h3 className="font-semibold text-lg">Check your inbox!</h3>
                            <p className="text-sm mt-1">{message}</p>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Input field with an icon inside */}
                            <motion.div className="relative mb-6" variants={itemVariants}>
                                <MailOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    className="w-full pl-12 pr-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                                    required
                                />
                            </motion.div>

                            <AnimatePresence>
                                {error && (
                                    <motion.p 
                                        className="text-red-500 text-sm text-center mb-4"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                            
                            {/* The "sexy" animated button */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-gray-800 to-black text-white py-3 font-semibold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <LoadingOutlined className="animate-spin mr-2" />
                                        Sending...
                                    </span>
                                ) : (
                                    'Reset Password'
                                )}
                            </motion.button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;