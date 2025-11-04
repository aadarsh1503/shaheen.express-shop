import React, { useState, useEffect } from "react";
// --- FIX: Change this import ---
import { Link as RouterLink } from "react-router-dom"; // Keep original for non-hash links
import { HashLink as Link } from 'react-router-hash-link'; // Use this for scrolling links
// --- End of FIX ---
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

  // A helper function to add smooth scrolling
  const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -80; // Offset for the fixed navbar height
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
  }

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
        <div className="w-full max-w-screen mx-auto flex items-center justify-between h-20 px-4 sm:px-6">
          
          <div className="flex-shrink-0">
            <a href="/" onClick={closeAllMenus}>
              <img src={i1} alt="Logo" className="h-20 w-auto" />
            </a>
          </div>

          <div className="hidden lg:flex font-semibold items-center lg:space-x-3 xl:space-x-6 lg:text-xs xl:text-sm uppercase tracking-wide">
            {/* These Links will now scroll correctly! */}
            <Link smooth to="/#services" className="hover:text-gray-200" scroll={scrollWithOffset}>Services</Link>
            <Link smooth to="/#why-us" className="hover:text-gray-200 whitespace-nowrap" scroll={scrollWithOffset}>Why Us</Link>
            <Link smooth to="/#clients" className="hover:text-gray-200" scroll={scrollWithOffset}>Clients</Link>
            <Link smooth to="/#partners" className="hover:text-gray-200" scroll={scrollWithOffset}>Partners</Link>
            
            {/* Use the original RouterLink for pages without hash scrolling */}
            <RouterLink to="/manPower" className="hover:text-gray-200">Delivery</RouterLink>
            <RouterLink to="/faq" className="hover:text-gray-200">FAQ</RouterLink>
            <RouterLink to="/privacy-policy" className="hover:text-gray-200 whitespace-nowrap">Privacy Policy</RouterLink>
            <RouterLink to="/T&C" className="hover:text-gray-200">T&C</RouterLink>
            <RouterLink to="/shop" className="hover:text-gray-200 whitespace-nowrap">Online Store</RouterLink>
            <RouterLink to="/tracking-Form" className="hover:text-gray-200">Tracking</RouterLink>
            
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
            {/* Also update the mobile menu links */}
            <Link smooth to="/#services" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Services</Link>
            <Link smooth to="/#why-us" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Why Us</Link>
            <Link smooth to="/#clients" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Clients</Link>
            <Link smooth to="/#partners" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Partners</Link>
            
            <RouterLink to="/manPower" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Delivery</RouterLink>
            <RouterLink to="/shop" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Online Store</RouterLink>
            <RouterLink to="/faq" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>FAQ</RouterLink>
            <RouterLink to="/privacy-policy" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Privacy Policy</RouterLink>
            <RouterLink to="/T&C" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>T&C</RouterLink>
            <RouterLink to="/tracking-Form" className="block px-6 py-2 hover:bg-white/10" onClick={toggleMobileMenu}>Tracking</RouterLink>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;