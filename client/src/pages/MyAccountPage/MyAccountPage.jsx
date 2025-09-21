// src/MyAccountPage.js
import React, { useState } from 'react';
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

// Import the form components
import BillingAddressForm from './BillingAddressForm';
import AccountDetailsForm from './AccountDetailsForm';

const MyAccountPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('dashboard');

  const email = location.state?.email || 'user@example.com';

  const handleLogout = () => {
    navigate('/login-shop');
  };

  const navItems = [
    { id: 'dashboard', icon: <LayoutGrid size={20} />, label: 'Dashboard' },
    { id: 'orders', icon: <Package size={20} />, label: 'Orders' },
    { id: 'wishlist', icon: <Heart size={20} />, label: 'Wishlist' },
    { id: 'downloads', icon: <Download size={20} />, label: 'Downloads' },
    { id: 'addresses', icon: <MapPin size={20} />, label: 'Addresses' },
    { id: 'account-details', icon: <User size={20} />, label: 'Account details' },
    { id: 'appointments', icon: <Plus size={20} />, label: 'Appointments' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="text-gray-600 leading-relaxed space-y-6">
            <p>
              Hello <strong className="font-semibold text-gray-800">{email}</strong> (not{' '}
              <strong className="font-semibold text-gray-800">{email}</strong>?{' '}
              <button onClick={handleLogout} className="text-gray-800 hover:underline">
                Log out
              </button>
              )
            </p>
            <p>
              From your account dashboard you can view your{' '}
              <button onClick={() => setActiveTab('orders')} className="font-semibold text-gray-800 hover:underline">
                recent orders
              </button>
              , manage your{' '}
              <button onClick={() => setActiveTab('addresses')} className="font-semibold text-gray-800 hover:underline">
                shipping and billing addresses
              </button>
              , and{' '}
              <button onClick={() => setActiveTab('account-details')} className="font-semibold text-gray-800 hover:underline">
                edit your password and account details
              </button>
              .
            </p>
          </div>
        );

      case 'orders':
        return (
          <div className="bg-gray-50 p-8 text-center border border-gray-200">
            <p className="text-gray-600">
              No order has been made yet.
              <button onClick={() => navigate('/shop')} className="ml-2 text-gray-800 hover:underline font-semibold">
                Browse products
              </button>
            </p>
          </div>
        );
      
      case 'addresses':
        return <BillingAddressForm userEmail={email} />;

      case 'account-details':
        return <AccountDetailsForm userEmail={email} />;

      // New case for the appointments tab
      case 'appointments':
        return (
          <div className="space-y-4">
            <div>
              <button
                onClick={() => navigate('/shop')}
                className="bg-[#212121] text-white py-2 px-6 font-semibold hover:bg-black transition-colors duration-200"
              >
                Book
              </button>
            </div>
            <p className="text-gray-600">
              No appointments scheduled yet.
            </p>
          </div>
        );

      default:
        return (
          <div className="text-gray-600">
            <p>The {navItems.find((item) => item.id === activeTab)?.label} section is currently empty.</p>
          </div>
        );
    }
  };

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
              <span className="text-gray-600 truncate">Hello {email}</span>
            </div>
            <ul>
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 py-3 text-gray-700 hover:text-black transition-colors w-full text-left ${
                      activeTab === item.id ? 'border-b-2 border-black font-medium' : ''
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-3 text-gray-700 hover:text-black transition-colors w-full text-left"
                >
                  <LogOut size={20} />
                  <span>Log out</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Right Content */}
          <main className="md:w-3/4">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;