import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Package, Heart, MapPin, User, LogOut, UserCircle2,
  ShoppingBag, ArrowRight, Settings, Bell, Star, Gift
} from 'lucide-react';

import BillingAddressForm from './BillingAddressForm';
import AccountDetailsForm from './AccountDetailsForm';
import OrdersSection from './OrdersSection';
import AddressesSection from './AddressesSection';
import { useAuth } from '../Context/AuthContext';
import LogoutAnimation from './LogoutAnimation';
import ConfirmationModal from './ConfirmationModal';
import { getCurrentUser } from '../frontend-admin/services/api';

const MyAccountPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getCurrentUser();
        setUserDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        if (error.response && error.response.status === 401) {
          logout();
          navigate('/login-shop');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDetails();

    // Check URL params for tab
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [logout, navigate]);

  // Step 1: User clicks logout, this opens the confirmation modal
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // Step 2: User confirms in the modal, this closes it and starts the final animation
  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    setIsLoggingOut(true);
  };

  // Step 3: The final animation finishes and calls this to actually log out
  const performLogout = () => {
    logout();
    navigate('/');
  };

  const handleDetailsUpdate = (updatedUserDetails) => {
    setUserDetails(updatedUserDetails);
  };

  const navItems = [
    { id: 'dashboard', icon: <LayoutGrid size={20} />, label: 'Dashboard', color: 'from-blue-500 to-blue-600' },
    { id: 'orders', icon: <Package size={20} />, label: 'Orders', color: 'from-[#EC2027] to-red-600' },
    { id: 'wishlist', icon: <Heart size={20} />, label: 'Wishlist', color: 'from-pink-500 to-pink-600' },
    { id: 'addresses', icon: <MapPin size={20} />, label: 'Addresses', color: 'from-green-500 to-green-600' },
    { id: 'account-details', icon: <User size={20} />, label: 'Account Details', color: 'from-purple-500 to-purple-600' },
  ];

  const renderContent = () => {
    const userDisplayName = userDetails?.name || userDetails?.email;

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-[#EC2027] to-red-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <UserCircle2 size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Welcome back, {userDisplayName}!</h2>
                    <p className="text-red-100">Manage your account and track your orders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#EC2027] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#EC2027] to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">0</p>
                    <p className="text-gray-600">Total Orders</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-pink-500 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">0</p>
                    <p className="text-gray-600">Wishlist Items</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-500 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">1</p>
                    <p className="text-gray-600">Saved Addresses</p>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Settings className="text-[#EC2027]" size={24} />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#EC2027] to-red-600 text-white rounded-lg hover:shadow-lg transition-all group"
                >
                  <Package size={20} />
                  <span className="font-semibold">View Recent Orders</span>
                  <ArrowRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => setActiveTab('addresses')}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all group"
                >
                  <MapPin size={20} />
                  <span className="font-semibold">Manage Addresses</span>
                  <ArrowRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => setActiveTab('account-details')}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all group"
                >
                  <User size={20} />
                  <span className="font-semibold">Update Profile</span>
                  <ArrowRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => navigate('/shop')}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all group"
                >
                  <ShoppingBag size={20} />
                  <span className="font-semibold">Continue Shopping</span>
                  <ArrowRight size={16} className="ml-auto group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Account Information</h3>
              <div className="text-gray-600 space-y-2">
                <p>
                  Hello <strong className="font-semibold text-gray-800">{userDisplayName}</strong> (not{' '}
                  <strong className="font-semibold text-gray-800">{userDisplayName}</strong>?{' '}
                  <button onClick={handleLogoutClick} className="text-[#EC2027] hover:underline font-semibold">
                    Log out
                  </button>
                  )
                </p>
                <p className="leading-relaxed">
                  From your account dashboard you can view your recent orders, manage your shipping and billing addresses, 
                  and edit your password and account details.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'orders':
        return <OrdersSection />;
      
      case 'addresses':
        return <AddressesSection />;
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
    <>
      {/* Renders the "Are you sure?" modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to end your session?"
        confirmText="Yes, Log Out"
        cancelText="Stay"
        icon={LogOut}
      />

      {/* Renders the "See you soon!" animation after confirmation */}
      {isLoggingOut && <LogoutAnimation onAnimationComplete={performLogout} />}
    
      <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen font-sans text-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-light text-gray-800 mb-4">My Account</h1>
            <p className="text-gray-600 text-lg">Manage your profile, orders, and preferences</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <nav className="lg:w-1/4 flex-shrink-0">
              {/* User Profile Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#EC2027] to-red-600 rounded-full flex items-center justify-center">
                    <UserCircle2 size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{userDetails?.name || 'User'}</h3>
                    <p className="text-gray-500 text-sm truncate">{userDetails?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Active Account</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <ul className="space-y-1 p-2">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 py-3 px-4 text-left w-full rounded-xl transition-all duration-200 group ${
                          activeTab === item.id 
                            ? 'bg-gradient-to-r from-[#EC2027] to-red-600 text-white shadow-lg' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#EC2027]'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          activeTab === item.id 
                            ? 'bg-white bg-opacity-20' 
                            : 'bg-gray-100 group-hover:bg-[#EC2027] group-hover:bg-opacity-10'
                        }`}>
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                        {activeTab === item.id && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </button>
                    </li>
                  ))}
                  
                  {/* Logout Button */}
                  <li className="pt-2 border-t border-gray-200 mt-2">
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-3 py-3 px-4 text-left w-full rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                    >
                      <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100">
                        <LogOut size={20} />
                      </div>
                      <span className="font-medium">Log Out</span>
                    </button>
                  </li>
                </ul>
              </div>
            </nav>

            {/* Main Content */}
            <main className="lg:w-3/4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[600px]">
                <div className="p-8">
                  {renderContent()}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccountPage;