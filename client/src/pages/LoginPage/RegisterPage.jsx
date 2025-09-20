import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white p-10 md:p-14 border border-gray-200">
        <h1 className="text-4xl font-light text-center text-gray-800 mb-10">
          Register
        </h1>

        <form>
          {/* Username Input */}
          <div className="mb-6">
            <input
              type="text"
              id="username"
              placeholder="Username *"
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
              className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500"
              required
            />
          </div>

          {/* Informational Text */}
          <p className="text-sm text-gray-600 mb-4">
            A link to set a new password will be sent to your email address.
          </p>
          <p className="text-sm text-gray-600 mb-8">
            Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <a href="/privacy-policy" className="text-gray-800 hover:underline">privacy policy</a>.
          </p>


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