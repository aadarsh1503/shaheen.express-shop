// src/pages/Shop_Navbar/Shop_Navbar.js (COMPLETE AND UPDATED)

import React, { useState, useEffect } from 'react';
import { Menu, Search, User, ShoppingCart, X, ChevronRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
// import MegaMenu from './MegaMenu'; // This component is defined below
import { useAuth } from '../Context/AuthContext';
import SearchOverlay from './SearchOverlay';
import LanguageSwitcher from '../../components/LanguageSwticher/LanguageSwitcher';

// --- SHOPPING CART SIDEBAR (This is where the fix is) ---
const ShoppingCartSidebar = ({ isOpen, onClose, cartItems, onRemoveItem, subtotal, currency }) => {
  const hasItems = cartItems && cartItems.length > 0;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="cart-heading" className="text-lg font-medium text-gray-900">Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close cart">
            <X size={24} />
          </button>
        </div>

        {!hasItems ? (
          <div className="flex flex-col items-center justify-center h-[calc(100%-65px)] p-6 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <ShoppingCart size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6">No products in the cart.</p>
            <Link
                to="/shop"
                onClick={onClose}
                className="w-full max-w-xs py-3 px-4 border border-[#EC2027] text-[#EC2027] font-semibold rounded-md hover:bg-[#EC2027] hover:text-white transition-colors duration-200"
            >
                Return to Shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col h-full" style={{ height: 'calc(100% - 65px)' }}>
            <div className="flex-grow overflow-y-auto p-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 py-3 border-b border-gray-200 items-center">
                  {/* ⭐️⭐️⭐️ CHANGE IS ON THIS LINE ⭐️⭐️⭐️ */}
                  <img 
                    src={item.image1 || item.image} // Use item.image1, but if it's missing, use item.image
                    alt={item.name} 
                    className="w-16 h-16 object-contain border border-gray-200 flex-shrink-0" 
                  />
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-800 leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.quantity} × {(parseFloat(item.price)).toFixed(3)} {currency}</p>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-2" 
                    aria-label={`Remove ${item.name}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t p-4 space-y-4 bg-gray-50">
                <div className="flex justify-between font-semibold text-gray-800">
                    <span>Subtotal:</span>
                    <span>{subtotal.toFixed(3)} {currency}</span>
                </div>
                <div className="flex gap-4">
                    <Link to="/cart" onClick={onClose} className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                        View cart
                    </Link>
                    <Link to="/checkout" onClick={onClose} className="flex-1 text-center py-2 px-4 bg-[#EC2027] text-white font-semibold rounded-md hover:bg-red-700 transition-colors">
                        Checkout
                    </Link>
                </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};


// --- NAVBAR COMPONENT (No changes needed here) ---
const Shop_Navbar = ({ cartItems = [], onRemoveItem, subtotal, currency }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY < 10);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isCartOpen || isMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isCartOpen, isMenuOpen, isSearchOpen]);

  return (
    <>
      <header className="w-full sticky top-0 z-30 transform-gpu">
        {isAtTop && (
          <div className="bg-[#EC2027] text-white py-2 px-4 text-sm font-medium flex items-center justify-between">
          <p className="flex-1 text-center">
            <a href="#" className="hover:underline ml-0 lg:ml-24">
              Shaheen Express اضغط هنا للتحويل لشاهين إكسبرس السعودية
            </a>
          </p>
          <div className="">
            <LanguageSwitcher />
          </div>
        </div>
        
        )}
        <nav className={`relative transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${isAtTop ? 'bg-white shadow-sm' : 'bg-white/50 backdrop-blur-md shadow-md'}`}>
          <div className="container mx-auto px-6 py-6 flex justify-between items-center">
            <div className="flex items-center gap-x-5">
              <button onClick={() => setIsMenuOpen(true)} className="text-gray-800 hover:text-black transition-colors" aria-label="Open menu">
                <Menu size={28} strokeWidth={1.5} />
              </button>
              <button onClick={() => setIsSearchOpen(true)} className="text-gray-800 hover:text-black transition-colors" aria-label="Search">
                <Search size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link to="/shop" aria-label="Go to homepage">
                <img src="https://shaheen-express-shop.vercel.app/assets/i1-3Ew8TKSD.png" alt="Zoom Logo" className="w-40 h-auto" />
              </Link>
            </div>
            <div className="flex items-center gap-x-5">
              <Link to={isAuthenticated ? '/my-account' : '/login-shop'}>
                <button className="text-gray-800 hover:text-black transition-colors" aria-label="My account">
                  <User size={24} strokeWidth={1.5} />
                </button>
              </Link>
              <button onClick={() => setIsCartOpen(true)} className="relative text-gray-800 hover:text-black transition-colors" aria-label="Shopping cart">
                <ShoppingCart size={24} strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#EC2027] text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>
      
      <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <ShoppingCartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={onRemoveItem}
        subtotal={subtotal}
        currency={currency}
      />

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};


// =====================================================================
// --- MEGAMENU COMPONENT (No changes needed here) ---
// =====================================================================
const menuData = {
  CATEGORIES: [
    {
      title: 'PACKAGING SUPPLIES',
      links: ['Cardboard Boxes', 'Shipping Mailers', 'Mailing Tubes', 'Envelopes', 'Custom Packaging', 'Poly Bags', 'Bubble Mailers'],
    },
    {
      title: 'SHIPPING MATERIALS',
      links: ['Packing Tape', 'Labels & Stickers', 'Bubble & Foam Wrap', 'Packing Peanuts', 'Cushioning', 'Stretch Film', 'Strapping'],
    },
    {
      title: 'WAREHOUSE & HANDLING',
      links: ['Pallets & Skids', 'Hand Trucks & Dollies', 'Scales', 'Utility Knives & Cutters', 'Markers & Pens', 'Inventory Tags', 'Industrial Bins'],
    },
  ],
};


const MegaMenu = ({ isOpen, onClose }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div
      className={`fixed inset-0 bg-[#EC2027] text-white z-50 flex
                 transition-transform duration-500 ease-in-out
                 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Thin Icon Sidebar */}
      <div className="w-20 bg-black bg-opacity-10 flex-shrink-0 flex flex-col items-center py-8 space-y-10">
        <button
          onClick={onClose}
          className="hover:opacity-75 transition-opacity"
          aria-label="Close menu"
        >
          <X size={28} />
        </button>
        <a
          href="/login-shop"
          className="hover:opacity-75 transition-opacity"
          aria-label="My Account"
          onMouseEnter={() => setActiveMenu(null)}
        >
          <User size={28} />
        </a>
        {/* --- CHANGE: Wishlist icon now triggers the 'Coming Soon' message --- */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          onMouseEnter={() => setActiveMenu('WISHLIST')}
          className="hover:opacity-75 transition-opacity"
          aria-label="Wishlist"
        >
          <Heart size={28} />
        </a>
      </div>

      {/* Main Menu Area */}
      <div 
        className="flex-grow flex overflow-y-auto"
        onMouseLeave={() => setActiveMenu(null)}
      >
        {/* Primary Navigation */}
        <div className="w-64 flex-shrink-0 p-12 font-thin tracking-widest">
          <ul className="space-y-6 text-lg">
            <li onMouseEnter={() => setActiveMenu(null)}><a href='/shop' className="hover:text-gray-200">HOME</a></li>
            <li onMouseEnter={() => setActiveMenu(null)}><a href='/shop' className="hover:text-gray-200 pb-1 border-b-2 border-white">SHOP</a></li>
            
            <li onMouseEnter={() => setActiveMenu('OFFERS')}>
              <a href="#" className={`hover:text-gray-200 ${activeMenu === 'OFFERS' ? 'pb-1 border-b-2 border-white' : ''}`}>
                OFFERS
              </a>
            </li>
            
            <li onMouseEnter={() => setActiveMenu('CATEGORIES')}>
              <a href="#" className={`flex justify-between items-center hover:text-gray-200 ${activeMenu === 'CATEGORIES' ? 'pb-1 border-b-2 border-white' : ''}`}>
                <span>CATEGORIES</span>
                <ChevronRight size={18} />
              </a>
            </li>
          </ul>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-grow p-12 pr-20">
            {activeMenu === 'CATEGORIES' && (
                <div className="grid grid-cols-3 gap-x-12 gap-y-8">
                    {menuData.CATEGORIES.map((column) => (
                        <div key={column.title}>
                            <h3 className="font-semibold tracking-widest mb-4 text-sm">{column.title}</h3>
                            <ul className="space-y-3 font-light tracking-wider text-xs">
                                {column.links.map((link) => (
                                    <li key={link}><a href="#" className="hover:text-gray-200">{link}</a></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {activeMenu === 'OFFERS' && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-black bg-opacity-20 p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold tracking-wider mb-2">Exclusive Offers</h3>
                        <p className="text-gray-200 font-light tracking-wide">
                            There are currently no special offers available.
                        </p>
                        <p className="text-gray-300 font-light tracking-wide mt-1 text-sm">
                            Please check back soon!
                        </p>
                    </div>
                </div>
            )}
            
            {/* --- CHANGE: New 'Coming Soon' display for Wishlist --- */}
            {activeMenu === 'WISHLIST' && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-black bg-opacity-20 p-8 rounded-lg shadow-lg">
                        <Heart size={48} className="mx-auto mb-4 text-white animate-pulse" />
                        <h3 className="text-2xl font-semibold tracking-wider mb-2">My Wishlist</h3>
                        <p className="text-xl text-gray-200 font-light tracking-wide">
                            Coming Soon!
                        </p>
                        <p className="text-gray-300 font-light tracking-wide mt-2 text-sm max-w-xs mx-auto">
                           We're crafting a special place for you to save and track all your favorite items.
                        </p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};


export default Shop_Navbar;