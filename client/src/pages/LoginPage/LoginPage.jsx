// src/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent page reload
    
    // For testing, we just need the email to be present.
    // In a real app, you would validate credentials here.
    if (email) {
      // Navigate to the my-account page and pass the FULL email in the state
      navigate('/my-account', { state: { email: email } });
    } else {
      alert('Please enter an email address to log in.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white p-10 md:p-14 border border-gray-200">
        <h1 className="text-4xl font-light text-center text-gray-800 mb-10">
          Login
        </h1>

        <form onSubmit={handleLogin}>
          {/* Username or Email Input */}
          <div className="mb-6">
            <input
              type="email" // Changed type to "email" for better semantics
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username or email address *"
              className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password *"
              className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-800"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Remember Me & Lost Password */}
          <div className="flex items-center justify-between mb-6 text-sm">
            <label htmlFor="remember-me" className="flex items-center cursor-pointer text-gray-600">
              <input type="checkbox" id="remember-me" className="h-4 w-4 border-gray-300 text-gray-800 focus:ring-gray-700" />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-gray-600 hover:text-gray-900 hover:underline">
              Lost your password?
            </a>
          </div>

          {/* Log in Button */}
          <button
            type="submit"
            className="w-full bg-[#212121] text-white py-3 font-semibold hover:bg-black transition-colors duration-200"
          >
            Log in
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Not a member? <a href="/register-shop" className="text-gray-800 hover:underline">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;