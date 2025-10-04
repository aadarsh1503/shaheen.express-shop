import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://shaheen-express-shop.onrender.com/api/admin/login', {
        email,
        password,
      });
      
      loginAdmin(response.data.token);
      navigate('/admin/products'); 

    } catch (err) { // <--- THIS IS THE CORRECTED LINE
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    // Futuristic gradient background
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex items-center justify-center p-4 font-sans">
      
      {/* Glassmorphism Login Card */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-12 border border-gray-200">
        
        {/* Logo Placeholder */}
        <div className="flex justify-center mb-6">
          {/* IMPORTANT: Replace this src with the path to your actual logo! */}
          <img src="https://shaheen--express.vercel.app/assets/i1-3Ew8TKSD.png" alt="Company Logo" className="h-16 w-auto" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-500 text-sm">Welcome back, please log in to continue.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input with Icon */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email address"
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Password Input with Icon and Toggle */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 text-center">
              {error}
            </div>
          )}

          {/* Gradient Submit Button with Hover Effect */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log In
          </button>
        </form>

        <div className="text-center mt-8">
          {/* <p className="text-sm text-gray-500">
            Need an admin account?{' '}
            <Link to="/admin/signup" className="font-semibold text-indigo-600 hover:underline">
              Register Here
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;