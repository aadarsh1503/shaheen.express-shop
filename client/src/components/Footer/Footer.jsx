import React, { useState } from "react";
import i1 from "./i1.png";
import i2 from "./i2.svg";
import "./Footer.css";
import { FaXTwitter } from "react-icons/fa6";
// Import necessary icons
import { FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

// A reusable SVG Wave Component for a clean, futuristic look
const Wave = () => (
  <div className="bg-gray-50">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 150">
      <path 
        fill="#ffffff" 
        fillOpacity="1" 
        d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,96C960,107,1056,117,1152,106.7C1248,96,1344,64,1392,48L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
  </div>
);

const Footer = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const emailOptions = [
    { label: "Customer Care", email: "ask@shaheen.express" },
    { label: "Seller Care", email: "contact@shaheen.express" },
    { label: "Business Enquiries", email: "info@shaheen.express" },
  ];

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    // ... (rest of your fetch logic is fine, no changes needed here)
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('list', '3efGv8921CUs1hPbvvIETKwQ'); // Replace with your list ID
      formData.append('subform', 'yes');
      await fetch('https://send.alzyara.com/subscribe', {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });
      setMessage('Thank you! You are now subscribed.');
      setEmail('');
    } catch (error) {
      setMessage('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const infoLinks = [
    { name: "About Us", href: "/aboutUs" },
    { name: "Services", href: "/#services" },
    { name: "Delivery", href: "/manPower" },
    { name: "FAQ", href: "/faq" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/t&c" },
    { name: "Tracking", href: "/tracking-Form" },
    { name: "Careers", href: "/https://www.talentportal.bh/#pills-profile" },
    { name: "User Data Protection Policy", href: "/user-data-protection" },
    { name: "Return & Refund Policy", href: "/return&refund" },
    { name: "Terms of Use", href: "/terms-of-use" },

  ];

  return (
    <footer className="bg-gray-50 font-poppins">
      
      {/* SECTION 1: Newsletter Call-to-Action */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Stay Ahead of the Curve
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter for the latest industry updates, special offers, and logistics insights delivered right to your inbox.
        </p>
        <form onSubmit={handleSubscribe} className="max-w-xl mx-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-full p-2 shadow-md focus-within:ring-2 focus-within:ring-dgreen/50 transition-all duration-300">
            <FaEnvelope className="text-dgreen text-xl mx-3" />
            <input
              type="email"
              placeholder="your.email@example.com"
              className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-dgreen text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
            >
              {loading ? 'Sending...' : 'Subscribe'}
            </button>
          </div>
          {message && <p className="text-sm mt-4 text-gray-600">{message}</p>}
        </form>
      </div>

      {/* SECTION 2: The Wave Divider */}
      <Wave />

      {/* SECTION 3: Main Footer Content */}
      <div className="bg-white pt-16 pb-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-6">
          
          {/* Column 1: Brand & Socials */}
          <div className="md:col-span-2">
            <img src={i1} alt="Shaheen Express Logo" className="w-40 mb-4"/>
            <p className="text-gray-600 max-w-sm mb-6">
              The key to your seamless logistics experience. We empower your business to focus on growth, we'll handle the logistics.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: FaFacebookF, href: "https://www.facebook.com/alshaheenexpress" },
                { icon: FaXTwitter, href: "https://x.com/shaheenexpress" },
                { icon: FaInstagram, href: "https://www.instagram.com/alshaheenexpress" },
              ].map((social, index) => (
                <a key={index} href={social.href} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-dgreen hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Information Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Explore</h3>
            <ul className="space-y-3">
              {infoLinks.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="flex items-center text-gray-600 hover:text-dgreen transition-all duration-300 transform hover:translate-x-1">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Legal & Other Links */}
           <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Resources</h3>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="flex items-center text-gray-600 hover:text-dgreen transition-all duration-300 transform hover:translate-x-1">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* SECTION 4: Bottom Bar with Address & Copyright */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p className="text-center sm:text-left mb-4 sm:mb-0">
            Copyright © {new Date().getFullYear()} SHAHEEN EXPRESS. All Rights Reserved.
          </p>
          <div className="flex items-center text-center">
            <FaMapMarkerAlt className="mr-2 text-dgreen"/>
            <p>P.O. Box 54121, Manama, Kingdom of Bahrain</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;