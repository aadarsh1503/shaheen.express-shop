import React, { useState, useEffect } from "react"; // Import useEffect
import { Link } from "react-router-dom";
import i1 from "./i1.png";
import { FaBars, FaTimes } from "react-icons/fa";
import { useDirection } from '../DirectionContext'; // Assuming you have this context
import LanguageSwitcher from "../LanguageSwticher/LanguageSwitcher";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- NEW: State to track if the page has been scrolled ---
  const [isScrolled, setIsScrolled] = useState(false);

  // --- NEW: Effect to handle scroll events ---
  useEffect(() => {
    const handleScroll = () => {

      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs only once on mount


  // Assuming useDirection might not be set up, providing a fallback
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
        <div className="container mx-auto flex max-w-8xl items-center justify-between px-6 h-24"> 
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <a href="/" onClick={closeAllMenus}>
              <img src={i1} alt="Logo" className="h-22 w-44" />
            </a>
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex font-semibold items-center space-x-6 text-sm uppercase tracking-wide">
            <Link to="/#services" className="hover:text-gray-200">Services</Link>
            <Link to="/#why-us" className="hover:text-gray-200 whitespace-nowrap">Why Us</Link>
            <Link to="/#clients" className="hover:text-gray-200">Clients</Link>
            <Link to="/#partners" className="hover:text-gray-200">Partners</Link>
            <Link to="/manPower" className="hover:text-gray-200">Delivery</Link>
            <Link to="/faq" className="hover:text-gray-200">FAQ</Link>
            <Link to="/privacy-policy" className="hover:text-gray-200 whitespace-nowrap">Privacy Policy</Link>
            <Link to="/T&C" className="hover:text-gray-200">T&C</Link>
            <Link to="/shop" className="hover:text-gray-200">Shop</Link>
            <Link to="/tracking-Form" className="hover:text-gray-200">Tracking</Link>
            <a href="https://www.talentportal.bh/#pills-profile" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
              Careers
            </a>

            {/* Email Section */}
            <div className="relative">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
                <div className="rounded-full shadow-md">
                  <img src="https://gtl.id/icon_email.svg" alt="Email Icon" className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold">EMAIL</span>
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-4 bg-white text-black shadow-lg rounded-lg p-4 w-48">
                  <ul>
                    {emailOptions.map((option, index) => (
                      <li key={index} className="mb-2">
                        <a href={`mailto:${option.email}`} className="flex flex-col text-sm hover:text-dgreen">
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

          {/* Hamburger Menu Icon */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} aria-label="Toggle menu">
              {isMobileMenuOpen ? (
                <FaTimes className="text-2xl cursor-pointer" />
              ) : (
                <FaBars className="text-2xl cursor-pointer" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          // --- APPLY GLASS EFFECT TO MOBILE MENU TOO ---
          <div className="md:hidden text-white text-sm uppercase font-semibold tracking-wide py-4 space-y-4 bg-dgreen/95 backdrop-blur-lg border-t border-white/10">
            <Link to="/#services" className="block px-6 hover:text-gray-200" onClick={toggleMobileMenu}>Services</Link>
            <Link to="/#why-us" className="block px-6 hover:text-gray-200" onClick={toggleMobileMenu}>Why Us</Link>
            <Link to="/#clients" className="block px-6 hover:text-gray-200" onClick={toggleMobileMenu}>Clients</Link>
            <Link to="/#partners" className="block px-6 hover:text-gray-200" onClick={toggleMobileMenu}>Partners</Link>
            <Link to="/manPower" className="block px-6 hover:text-gray-200" onClick={toggleMobileMenu}>Delivery</Link>
            <Link to="/faq" className="block px-6 hover:text-gray-200" onClick={toggleMobileMenu}>FAQ</Link>
            <Link to="/privacy-policy" className="block px-6 hover:text-gray-200" onClick={toggleMobileMenu}>Privacy Policy</Link>
            <Link to="/T&C" className="block px-6 hover:text-gray-200" onClick={toggleMobileMenu}>T&C</Link>
            <Link to="/tracking-Form" className="block px-6 hover:text-gray-200" onClick={toggleMobileMenu}>Tracking</Link>
            <a href="https://www.talentportal.bh/#pills-profile" target="_blank" rel="noopener noreferrer" className="block px-6 hover:text-gray-200" onClick={toggleMobileMenu}>
              Careers
            </a>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;