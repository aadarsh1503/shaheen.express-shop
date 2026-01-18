import React from 'react';
import { useLocation } from 'react-router-dom';
import { Package, Filter, ShoppingBag, Store, LogOut } from 'lucide-react';

const AdminNavigation = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    {
      path: '/admin/products',
      label: 'Products',
      icon: Package,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    // {
    //   path: '/admin/categories',
    //   label: 'Categories',
    //   icon: Filter,
    //   color: 'bg-green-600 hover:bg-green-700'
    // },
    {
      path: '/admin/orders',
      label: 'Orders',
      icon: ShoppingBag,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      path: '/admin/Product-shop',
      label: 'Shop Products',
      icon: Store,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <a key={item.path} href={item.path}>
            <button 
              className={`flex items-center font-bold py-2.5 px-5 rounded-lg shadow-md transition-all transform hover:scale-105 ${
                isActive 
                  ? 'bg-[#EC2027] text-white' 
                  : `${item.color} text-white`
              }`}
            >
              <Icon className="mr-2 h-5 w-5" />
              {item.label}
            </button>
          </a>
        );
      })}
      
      {onLogout && (
        <button
          onClick={onLogout}
          className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-all transform hover:scale-105"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </button>
      )}
    </div>
  );
};

export default AdminNavigation;