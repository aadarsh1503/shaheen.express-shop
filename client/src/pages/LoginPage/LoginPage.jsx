// src/pages/LoginPage/LoginPage.js (Corrected)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { loginUser } from '../frontend-admin/services/api';


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Optional: for loading state
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); // This will now work correctly

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/my-account', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Call the API function to perform the login
      const response = await loginUser(email, password);
      
      // 2. Extract the token from the API response
      //    (Assuming your backend sends { token: '...' })
      const { token } = response.data;

      if (token) {
        // 3. If we get a token, update the AuthContext
        login(token);
        // The useEffect will handle the navigation automatically
      } else {
        setError('Login failed: No token received from server.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
        setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return null; // Prevent flash of login form if already authenticated
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white p-10 md:p-14 border border-gray-200">
        <h1 className="text-4xl font-light text-center text-gray-800 mb-10">
          Login
        </h1>

        <form onSubmit={handleLogin}>
          {/* ... (Your input fields for email and password remain the same) ... */}
          <div className="mb-6">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username or email address *"
              className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500"
              required
            />
          </div>
          <div className="mb-6 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <div className="flex items-end justify-end mb-6 text-sm">
            <Link to="/forgot-password" className="text-gray-600 hover:text-gray-900 hover:underline">
              Lost your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading} // Disable button while logging in
            className="w-full bg-[#212121] text-white py-3 font-semibold hover:bg-black transition-colors duration-200 disabled:bg-gray-400"
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

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