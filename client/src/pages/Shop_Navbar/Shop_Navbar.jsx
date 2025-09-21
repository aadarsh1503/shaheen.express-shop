// src/pages/Shop_Navbar/Shop_Navbar.js
import React, { useState, useEffect } from 'react';
import { Menu, Search, User, ShoppingCart, X } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link
import MegaMenu from './MegaMenu';

// --- UPDATED SHOPPING CART SIDEBAR ---
const ShoppingCartSidebar = ({ isOpen, onClose, cartItems, onRemoveItem, subtotal, currency }) => {
  const hasItems = cartItems && cartItems.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sidebar Panel */}
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

        {/* Conditional Content */}
        {!hasItems ? (
          // Empty Cart View
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
          // Cart with Items View
          <div className="flex flex-col h-full" style={{ height: 'calc(100% - 65px)' }}>
            {/* Item List */}
            <div className="flex-grow overflow-y-auto p-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 py-3 border-b border-gray-200 items-center">
                  <img src={item.image1} alt={item.name} className="w-16 h-16 object-contain border border-gray-200 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-800 leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.quantity} × {(parseFloat(item.price)).toFixed(3)} {currency}</p>
                  </div>
                  <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-2" aria-label={`Remove ${item.name}`}>
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer with Totals & Links */}
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


// --- UPDATED NAVBAR COMPONENT ---
// It now accepts props to pass down to the sidebar
const Shop_Navbar = ({ cartItems = [], onRemoveItem, subtotal, currency }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Calculate item count directly from the passed-in cartItems prop
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
    if (isCartOpen || isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isCartOpen, isMenuOpen]);

  return (
    <>
      <header className="w-full sticky top-0 z-30 transform-gpu">
        {isAtTop && (
          <div className="bg-[#EC2027] text-white text-center py-2 px-4 text-sm font-medium">
            <p>
              <a href="#" className="hover:underline">
                Shaheen Express اضغط هنا للتحويل لشاهين إكسبرس السعودية
              </a>
            </p>
          </div>
        )}
        <nav className={`relative transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${isAtTop ? 'bg-white shadow-sm' : 'bg-white/50 backdrop-blur-md shadow-md'}`}>
          <div className="container mx-auto px-6 py-6 flex justify-between items-center">
            <div className="flex items-center gap-x-5">
              <button onClick={() => setIsMenuOpen(true)} className="text-gray-800 hover:text-black transition-colors" aria-label="Open menu">
                <Menu size={28} strokeWidth={1.5} />
              </button>
              <button className="text-gray-800 hover:text-black transition-colors" aria-label="Search">
                <Search size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link to="/shop" aria-label="Go to homepage">
                <img src="https://shaheen-express-shop.vercel.app/assets/i1-3Ew8TKSD.png" alt="Zoom Logo" className="w-40 h-auto" />
              </Link>
            </div>
            <div className="flex items-center gap-x-5">
              <a href='/login-shop'>
              <button className="text-gray-800 hover:text-black transition-colors" aria-label="My account">
                <User size={24} strokeWidth={1.5} />
              </button>
              </a>
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
      
      {/* Pass all necessary props to the sidebar */}
      <ShoppingCartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={onRemoveItem}
        subtotal={subtotal}
        currency={currency}
      />
    </>
  );
};

export default Shop_Navbar;