import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../Context/AuthContext'; // Path might be different, e.g., './Context/AuthContext'
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); // Get login function from context

  useEffect(() => {
    // If user is already logged in, redirect them
    if (isAuthenticated) {
      navigate('/my-account', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
        toast.error("Please fill in both email and password.");
        setIsLoading(false);
        return;
    }

    try {
      // SIMPLY CALL THE LOGIN FUNCTION FROM THE CONTEXT
      // It will handle the API call, token, and cart merge
      await login(email, password);
      
      toast.success("Login successful! Welcome back.");
      // The useEffect will handle navigation, or you can navigate here too
      navigate('/my-account'); 

    } catch (err) {
      // The context's login function will throw an error if the API fails
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  // Prevent flash of login form if already authenticated
  if (isAuthenticated) {
    return null; 
  }

  return (
    <div dir='ltr' className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white p-10 md:p-14 border border-gray-200">
        <h1 className="text-4xl font-light text-center text-gray-800 mb-10">
          Login
        </h1>

        <form onSubmit={handleLogin}>
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

          <div className="flex items-end justify-end mb-6 text-sm">
            <Link to="/forgot-password" className="text-gray-600 hover:text-gray-900 hover:underline">
              Lost your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#212121] text-white py-3 font-semibold hover:bg-black transition-colors duration-200 disabled:bg-gray-400"
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Not a member? <Link to="/register-shop" className="text-gray-800 hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;