import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminSignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/admin/signup', {
        name,
        email,
        password,
      });

      setSuccess(response.data.message + ' Redirecting to login...');
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white p-10 md:p-14 border border-gray-200 shadow-lg">
        <h1 className="text-4xl font-light text-center text-gray-800 mb-10">
          Admin Registration
        </h1>

        <form onSubmit={handleSignup}>
          <div className="mb-6">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name *" className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
          </div>
          <div className="mb-6">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email address *" className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
          </div>
          <div className="mb-6">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password *" className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" required />
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 font-semibold hover:bg-indigo-700 transition-colors">
            Register
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an admin account? <Link to="/admin/login" className="text-indigo-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignupPage;