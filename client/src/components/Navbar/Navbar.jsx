import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import i1 from "./i1.png";
import { FaBars, FaTimes } from "react-icons/fa";
import { useDirection } from '../DirectionContext';
import LanguageSwitcher from "../LanguageSwticher/LanguageSwitcher";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { direction } = useDirection ? useDirection() : { direction: 'ltr' };

  const emailOptions = [
    { label: "Customer Care", email: "ask@shaheen.express" },
    { label: "Seller Care", email: "contact@shaheen.express" },
    { label: "Business Enquiries", email: "info@shaheen.express" },
  ];

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="">
      <nav
        className={`fixed top-0 w-full z-50 text-white transition-all duration-300 ease-in-out
          ${isScrolled
            ? 'bg-dgreen/90 backdrop-blur-lg shadow-lg border-b border-white/10'
            : 'bg-dgreen/85 border-b border-transparent'
          }
        `}
      >
        {/* --- FIX 1: Use a fluid container with a max-width for better adaptability --- */}
        {/* This allows the navbar to use all available space up to a reasonable maximum width. */}
        <div className="w-full max-w-screen mx-auto flex items-center justify-between h-20 px-4 sm:px-6">
          
          <div className="flex-shrink-0">
            <a href="/" onClick={closeAllMenus}>
              <img src={i1} alt="Logo" className="h-20 w-auto" />
            </a>
          </div>

          {/* --- FIX 2 & 3: Make font size and spacing RESPONSIVE to create an "elastic" menu --- */}
          {/* At the `lg` breakpoint (1024px), use smaller text and spacing. */}
          {/* At the `xl` breakpoint (1280px), increase them again. */}
          {/* This gracefully handles zoom and slightly smaller screens. */}
          <div className="hidden lg:flex font-semibold items-center lg:space-x-3 xl:space-x-6 lg:text-xs xl:text-sm uppercase tracking-wide">
            <Link to="/#services" className="hover:text-gray-200">Services</Link>
            <Link to="/#why-us" className="hover:text-gray-200 whitespace-nowrap">Why Us</Link>
            <Link to="/#clients" className="hover:text-gray-200">Clients</Link>
            <Link to="/#partners" className="hover:text-gray-200">Partners</Link>
            <Link to="/manPower" className="hover:text-gray-200">Delivery</Link>
            <Link to="/faq" className="hover:text-gray-200">FAQ</Link>
            <Link to="/privacy-policy" className="hover:text-gray-200 whitespace-nowrap">Privacy Policy</Link>
            <Link to="/T&C" className="hover:text-gray-200">T&C</Link>
            <Link to="/shop" className="hover:text-gray-200 whitespace-nowrap">Online Store</Link>
            <Link to="/tracking-Form" className="hover:text-gray-200">Tracking</Link>
            
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 cursor-pointer"
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <div className="rounded-full shadow-md">
                  <img src="https://res.cloudinary.com/dtjskgsnk/image/upload/v1758457999/images__1_-removebg-preview_cjenmk.png" alt="Email Icon" className="h-5 w-5" />
                </div>
                {/* The text inside this button will also scale based on the parent's text-size class */}
                <span className="font-semibold">EMAIL</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-4 bg-white text-black shadow-lg rounded-lg p-4 w-52 z-10 text-sm normal-case">
                  <ul>
                    {emailOptions.map((option, index) => (
                      <li key={index} className="mb-2">
                        <a href={`mailto:${option.email}`} className="flex flex-col hover:text-dgreen">
                          <span className="font-semibold">{option.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <LanguageSwitcher />
          </div>

          <div className="lg:hidden">
            <button onClick={toggleMobileMenu} aria-label="Toggle menu">
              {isMobileMenuOpen ? (
                <FaTimes className="text-3xl cursor-pointer" />
              ) : (
                <FaBars className="text-3xl cursor-pointer" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden text-white text-base normal-case font-medium py-4 bg-dgreen/95 backdrop-blur-lg border-t border-white/10">
            <Link to="/#services" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Services</Link>
            <Link to="/#why-us" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Why Us</Link>
            <Link to="/#clients" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Clients</Link>
            <Link to="/#partners" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Partners</Link>
            <Link to="/manPower" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Delivery</Link>
            <Link to="/shop" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Online Store</Link>
            <Link to="/faq" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>FAQ</Link>
            <Link to="/privacy-policy" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Privacy Policy</Link>
            <Link to="/T&C" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>T&C</Link>
            <Link to="/tracking-Form" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Tracking</Link>
            {/* <a href="https://www.talentportal.bh/#pills-profile" target="_blank" rel="noopener noreferrer" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>
              Careers
            </a> */}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;