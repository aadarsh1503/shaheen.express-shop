import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  // NEW: State for form fields, errors, and loading
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // NEW: Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('https://shaheen-express-shop.onrender.com/api/auth/signup', {
        name,
        email,
        password,
      });

      setSuccess(response.data.message + ' Redirecting to login...');
      setTimeout(() => {
        navigate('/login-shop');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white p-10 md:p-14 border border-gray-200">
        <h1 className="text-4xl font-light text-center text-gray-800 mb-10">
          Register
        </h1>

        {/* UPDATED: Form now calls handleRegister */}
        <form onSubmit={handleRegister}>
          {/* Username Input */}
          <div className="mb-6">
            <input
              type="text"
              id="username"
              placeholder="Username *"
              value={name} // UPDATED
              onChange={(e) => setName(e.target.value)} // UPDATED
              className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <input
              type="email"
              id="email"
              placeholder="Email address *"
              value={email} // UPDATED
              onChange={(e) => setEmail(e.target.value)} // UPDATED
              className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500"
              required
            />
          </div>
          
          {/* NEW: Password Field - Required by backend */}
          <div className="mb-6">
            <input
              type="password"
              id="password"
              placeholder="Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500"
              required
              minLength="6"
            />
          </div>

          {/* Informational Text */}
          <p className="text-sm text-gray-600 mb-8">
            Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <a href="/privacy-policy" className="text-gray-800 hover:underline">privacy policy</a>.
          </p>

          {/* NEW: Display error or success messages */}
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-[#212121] text-white py-3 font-semibold hover:bg-black transition-colors duration-200"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already a member? <Link to="/login-shop" className="text-gray-800 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;