import React from 'react';
import { Instagram, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

// --- Custom Icons ---
// A simple SVG component for the TikTok icon to match the style.
const TikTokIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 6.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z"></path>
    <path d="M12 11v8"></path>
    <path d="M9 19a3 3 0 0 0 3-3V6.5"></path>
  </svg>
);

// A simple SVG component for the WhatsApp icon.
const WhatsAppIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);


// --- Custom SVG Logo (White Version) ---
const ZoomLogoWhite = () => (
    <svg width="200" height="50" viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg" aria-label="ZOOM Logo">
        <style>
            {`.line-art-white{fill:none;stroke:white;stroke-miterlimit:10;stroke-width:1.2px;}`}
        </style>
        <path className="line-art-white" d="M5.5 5.5h20l-20 29h20"/>
        <g transform="translate(47.5, 20)">
            <path d="M 14.5 0 L 7.25 12.57 L -7.25 12.57 L -14.5 0 L -7.25 -12.57 L 7.25 -12.57 Z" fill="none" stroke="white" strokeWidth="1.2"/>
        </g>
        <circle className="line-art-white" cx="82.5" cy="20" r="14.5"/>
        <path className="line-art-white" d="M100.5 34.5l7-29 7 29 7-29 7 29"/>
    </svg>
);

const ShopFooter = () => {
  
  // Function for the "Scroll to Top" button
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="w-full">
      {/* Main Footer Section */}
      <div className="bg-[#EC2027] text-white font-thin">
        <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Logo & Tagline */}
          <div className="space-y-4">
  <img 
    src="https://shaheen-express-shop.vercel.app/assets/i1-Jri-U_l6.png" 
    alt="Zoom Logo White" 
    className="w-32 h-auto" 
  />
  <p className="text-sm tracking-wider">Click it or miss it</p>
</div>


          {/* Column 2: Useful Links */}
          <div className="space-y-4">
            <h3 className="text-xl tracking-wide">Useful links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:opacity-75 transition-opacity">Privacy Policy</a></li>
              <li><a href="#" className="hover:opacity-75 transition-opacity">Terms & Conditions</a></li>
              <li><a href="#" className="hover:opacity-75 transition-opacity">Refund and Returns Policy</a></li>
            </ul>
          </div>

          {/* Column 3: Follow Us */}
          <div className="space-y-4">
            <h3 className="text-xl tracking-wide">Follow us</h3>
            <p className="text-sm">Follow us on social media</p>
            <div className="flex items-center space-x-4">
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="Email"><Mail size={20} /></a>
              <a href="#" aria-label="WhatsApp"><WhatsAppIcon className="h-5 w-5" /></a>
              <a href="#" aria-label="TikTok"><TikTokIcon className="h-5 w-5" /></a>
              <a href="#" aria-label="Phone"><Phone size={20} /></a>
              <a href="#" aria-label="Location"><MapPin size={20} /></a>
            </div>
            <p className="text-sm pt-2">SAT - THU 9am - 9pm</p>
          </div>

          {/* Column 4: eFada Image */}
          <div className="flex justify-start lg:justify-center">
            <a href="#" className="text-center">
              {/* Add your eFada image source here */}
              <img src="https://service.moic.gov.bh/newefadaapi/Images/image-w-2.png" alt="eFada Certified" className="h-20 w-auto" />
              <p className="text-xs mt-1">moic.gov.bh</p>
            </a>
          </div>

        </div>
      </div>

      {/* Sub-Footer Section */}
      <div className="bg-[#ff2323] text-white font-thin">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          
          {/* Copyright */}
          <p className="text-xs tracking-wider">
            2025 Shaheen Express
          </p>
          
          {/* Payment Icons */}
          <div className="flex items-center space-x-2">
            {/* Add your payment icon image sources here */}
            <img src="https://zoom.bh/wp-content/uploads/2023/10/payment-300x25-1.png" alt="Payment Methods" className="h-8"/>
          </div>
          
          {/* Scroll to Top Button */}
          <button 
            onClick={scrollToTop}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors rounded-full h-10 w-10 flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ShopFooter;