import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Package, Heart, Download, MapPin, User, Plus, LogOut, UserCircle2,
  // 1. Import the new icons for the empty state
  ShoppingBag, ArrowRight, 
} from 'lucide-react';

import BillingAddressForm from './BillingAddressForm';
import AccountDetailsForm from './AccountDetailsForm';
import { useAuth } from '../Context/AuthContext';
import { getCurrentUser } from '../frontend-admin/services/api';

const MyAccountPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getCurrentUser();
        setUserDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        if (error.response && error.response.status === 401) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDetails();
  }, [logout]);

  const handleLogout = () => {
    logout();
  };
  
  const handleDetailsUpdate = (updatedUserDetails) => {
    setUserDetails(updatedUserDetails);
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
    const userDisplayName = userDetails?.name || userDetails?.email;

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="text-gray-600 leading-relaxed space-y-6">
            <p>
              Hello <strong className="font-semibold text-gray-800">{userDisplayName}</strong> (not{' '}
              <strong className="font-semibold text-gray-800">{userDisplayName}</strong>?{' '}
              <button onClick={handleLogout} className="text-gray-800 hover:underline font-semibold">
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
        
      // --- 2. THIS IS THE UPDATED SECTION ---
      case 'orders':
        return (
          <div className="text-center bg-gray-50/50 p-10 sm:p-16 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mb-6" strokeWidth={1.5} />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Your Order History is Empty
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              It looks like you haven't placed an order yet. Let's find something you'll love!
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Shopping
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        );
      
      case 'addresses':
        return <BillingAddressForm userEmail={userDetails?.email} />;
      case 'account-details':
        return (
          <AccountDetailsForm
            userDetails={userDetails}
            onUpdateSuccess={handleDetailsUpdate}
          />
        );
      default:
        return <p>Section coming soon.</p>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500">Loading your account...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-light text-center mb-16">My account</h1>
        <div className="flex flex-col md:flex-row gap-12">
          <nav className="md:w-1/4 flex-shrink-0">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <UserCircle2 size={32} className="text-gray-500" />
              </div>
              <span className="text-gray-600 truncate">Hello {userDetails?.name || userDetails?.email}</span>
            </div>
            <ul>
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 py-3 text-gray-700 hover:text-black transition-colors w-full text-left ${activeTab === item.id ? 'border-b-2 border-black font-medium' : ''}`}
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
          <main className="md:w-3/4">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;