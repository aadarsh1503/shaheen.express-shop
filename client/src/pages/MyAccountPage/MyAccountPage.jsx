// src/MyAccountPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Package,
  Heart,
  Download,
  MapPin,
  User,
  Plus,
  LogOut,
  UserCircle2,
} from 'lucide-react';

const MyAccountPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get username from state passed by login page, with a fallback
  const username = location.state?.username || 'aadi1234';

  const handleLogout = () => {
    // Navigate back to the login page
    navigate('/login-shop');
  };

  const navItems = [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard', active: true },
    { icon: <Package size={20} />, label: 'Orders' },
    { icon: <Heart size={20} />, label: 'Wishlist' },
    { icon: <Download size={20} />, label: 'Downloads' },
    { icon: <MapPin size={20} />, label: 'Addresses' },
    { icon: <User size={20} />, label: 'Account details' },
    { icon: <Plus size={20} />, label: 'Appointments' },
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-light text-center mb-16">My account</h1>
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Navigation */}
          <nav className="md:w-1/4 flex-shrink-0">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <UserCircle2 size={32} className="text-gray-500" />
              </div>
              <span className="text-gray-600">Hello {username}</span>
            </div>
            <ul>
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`flex items-center gap-3 py-3 text-gray-700 hover:text-black transition-colors ${
                      item.active ? 'border-b-2 border-black' : ''
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-3 text-gray-700 hover:text-black transition-colors w-full"
                >
                  <LogOut size={20} />
                  <span>Log out</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Right Content */}
          <main className="md:w-3/4">
            <div className="text-gray-600 leading-relaxed space-y-6">
              <p className='bg-gray-50 border-l-2 border-gray-400 p-4 text-sm'>
                Your account with Shaheen Express is using a temporary password. We emailed you a link to change your password.
              </p>
              <p>
                Hello <strong className="font-semibold text-gray-800">{username}</strong> (not <strong className="font-semibold text-gray-800">{username}</strong>?{' '}
                <button onClick={handleLogout} className="text-gray-800 hover:underline">
                  Log out
                </button>
                )
              </p>
              <p>
                From your account dashboard you can view your{' '}
                <a href="#" className="font-semibold text-gray-800 hover:underline">
                  recent orders
                </a>
                , manage your{' '}
                <a href="#" className="font-semibold text-gray-800 hover:underline">
                  shipping and billing addresses
                </a>
                , and{' '}
                <a href="#" className="font-semibold text-gray-800 hover:underline">
                  edit your password and account details
                </a>
                .
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;