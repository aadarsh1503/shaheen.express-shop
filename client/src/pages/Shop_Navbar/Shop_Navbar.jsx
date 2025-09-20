import React, { useState } from 'react';
import { Menu, Search, User, ShoppingCart } from 'lucide-react';
import MegaMenu from './MegaMenu';

// Custom SVG Logo Component to perfectly match the design.
const ZoomLogo = () => {
    return (
        <svg width="140" height="40" viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg" aria-label="ZOOM Logo">
            <style>
                {`.line-art{fill:none;stroke:#212121;stroke-miterlimit:10;stroke-width:1.2px;}`}
            </style>
            <path className="line-art" d="M5.5 5.5h20l-20 29h20"/>
            <g transform="translate(47.5, 20)">
                <path d="M 14.5 0 L 7.25 12.57 L -7.25 12.57 L -14.5 0 L -7.25 -12.57 L 7.25 -12.57 Z" fill="#01A89C"/>
            </g>
            <circle className="line-art" cx="82.5" cy="20" r="14.5"/>
            <path className="line-art" d="M100.5 34.5l7-29 7 29 7-29 7 29"/>
        </svg>
    );
};


// Updated Navbar Component
const Shop_Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control the menu
  const cartItemCount = 1;

  return (
    <> {/* Use a fragment to return multiple elements */}
      <header className="shadow-sm w-full">
        {/* Top announcement bar */}
        <div className="bg-[#01A89C] text-white text-center py-2 px-4 text-sm font-medium">
          <p>
            <a href="#" className="hover:underline">
              ZOOM KSA اضغط هنا للتحويل لزووم السعودية
            </a>
          </p>
        </div>

        {/* Main navigation */}
        <nav className="bg-white relative">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            
            {/* Left side: Menu and Search */}
            <div className="flex items-center gap-x-5">
              <button 
                onClick={() => setIsMenuOpen(true)} // This button now opens the menu
                className="text-gray-800 hover:text-black transition-colors" 
                aria-label="Open menu"
              >
                <Menu size={28} strokeWidth={1.5} />
              </button>
              {/* ... search button */}
               <button className="text-gray-800 hover:text-black transition-colors" aria-label="Search">
                 <Search size={24} strokeWidth={1.5} />
               </button>
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <a href="/" aria-label="Go to homepage">
                <ZoomLogo />
              </a>
            </div>

            {/* Right side: User and Cart */}
            <div className="flex items-center gap-x-5">
                {/* ... user and cart buttons */}
                 <button className="text-gray-800 hover:text-black transition-colors" aria-label="My account">
                   <User size={24} strokeWidth={1.5} />
                 </button>
                 <button className="relative text-gray-800 hover:text-black transition-colors" aria-label="Shopping cart">
                   <ShoppingCart size={24} strokeWidth={1.5} />
                   {cartItemCount > 0 && (
                     <span 
                       className="absolute -top-1.5 -right-2 bg-[#01A89C] text-white text-xs font-semibold
                                  rounded-full h-5 w-5 flex items-center justify-center border-2 border-white"
                     >
                       {cartItemCount}
                     </span>
                   )}
                 </button>
            </div>

          </div>
        </nav>
      </header>

      {/* Render the MegaMenu and pass state to it */}
      <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Shop_Navbar;