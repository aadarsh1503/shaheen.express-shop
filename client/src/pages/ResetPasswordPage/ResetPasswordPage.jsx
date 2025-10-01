// src/pages/ResetPasswordPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { resetPassword } from '../frontend-admin/services/api';

// A simple hook to get window dimensions for the confetti effect
const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return { width: size[0], height: size[1] };
};

// A reusable, beautifully styled input field component
const InputField = ({ label, type, value, onChange, placeholder, onToggleVisibility, isVisible }) => (
    <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <div className="relative">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 text-sm text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300"
                required
            />
            {onToggleVisibility && (
                <button type="button" onClick={onToggleVisibility} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors">
                    {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}
        </div>
    </div>
);


const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { width, height } = useWindowSize();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setIsLoading(true);
        setError('');
        
        try {
            // NOTE: The resetPassword function is called here.
            // We are simulating a delay to showcase the loading animation.
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            const res = await resetPassword(token, password);

            setSuccessMessage(res.data.message || 'Your password has been changed successfully!');
            setIsSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // This is the "very sexy" success screen
    if (isSuccess) {
        return (
            <>
                <Confetti width={width} height={height} recycle={false} numberOfPieces={400} tweenDuration={10000} />
                <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 font-sans">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="w-full max-w-md bg-white/70 backdrop-blur-xl p-10 md:p-14 rounded-3xl shadow-2xl text-center border border-green-200"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
                        >
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" strokeWidth={1.5} />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
                            All Set!
                        </h1>
                        <p className="text-gray-600 mb-8">{successMessage}</p>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(34, 197, 94, 0.25)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/login-shop')}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 font-semibold rounded-xl shadow-lg transition-all duration-300"
                        >
                            Proceed to Login
                        </motion.button>
                    </motion.div>
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen  mt-20 flex items-center justify-center p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md bg-white p-10 md:p-14 rounded-3xl shadow-2xl border border-gray-200/50"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tighter">
                        Create New Password
                    </h1>
                    <p className="text-gray-500 mt-3">Your new password must be secure and memorable.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter at least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onToggleVisibility={() => setShowPassword(!showPassword)}
                        isVisible={showPassword}
                    />
                    <InputField
                        label="Confirm New Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Repeat your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                        isVisible={showConfirmPassword}
                    />

                    <AnimatePresence>
                        {error && (
                             <motion.p
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="text-red-600 bg-red-50 p-3 rounded-lg text-sm text-center font-medium"
                             >
                                 {error}
                             </motion.p>
                        )}
                    </AnimatePresence>

                    <div className="mt-8">
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: isLoading ? 1 : 1.03 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-gray-800 to-black text-white py-3 px-6 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-gray-800/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Updating Password...</span>
                                </>
                            ) : (
                                'Save New Password'
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;