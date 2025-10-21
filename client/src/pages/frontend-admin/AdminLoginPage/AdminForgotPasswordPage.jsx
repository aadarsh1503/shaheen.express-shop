import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
// Import the specific API function
import { adminForgotPassword } from '../services/api';

export default function AdminForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            // Use the clean, imported API function
            const res = await adminForgotPassword(email);
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // The JSX remains exactly the same. No changes needed here.
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-12 border border-gray-200">
                <div className="flex justify-center mb-6">
                    <img src="https://shaheen--express.vercel.app/assets/i1-3Ew8TKSD.png" alt="Company Logo" className="h-16 w-auto" />
                </div>
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Recovery</h1>
                    <p className="text-gray-500 text-sm">
                        {message ? "Check your inbox for the next steps." : "Enter your email to receive a reset link."}
                    </p>
                </div>
                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-4 text-center mb-6">
                        {message}
                    </div>
                )}
                {error && !message && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4 text-center mb-6">
                        {error}
                    </div>
                )}
                {!message && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Admin email address"
                                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}
                <div className="text-center mt-8">
                    <Link 
                        to="/admin/login" 
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}