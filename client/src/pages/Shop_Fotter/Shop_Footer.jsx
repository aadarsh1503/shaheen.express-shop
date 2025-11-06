import React from 'react';
import { Instagram, ArrowUp } from 'lucide-react';
import { FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// This is the combined and updated component
const ShopFooter = () => {
  
  // --- Links from the first Footer component ---
  const infoLinks = [
    { name: "About Us", href: "/aboutUs" },
    { name: "Services", href: "/#services" },
    // { name: "Online Store", href: "/shop" },
    { name: "Delivery", href: "/manPower" },
    { name: "FAQ", href: "/faq" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/t&c" },
    { name: "Tracking", href: "/tracking-Form" },
    { name: "User Data Protection Policy", href: "/user-data-protection" },
    { name: "Return & Refund Policy", href: "/return&refund" },
    { name: "Terms of Use", href: "/terms-of-use" },
  ];

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
        {/* Changed grid to 5 columns on large screens to accommodate all links */}
        <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Column 1: Logo & Tagline */}
          <div className="space-y-4 lg:col-span-1">
            <img 
              src="https://shaheen-express-shop.vercel.app/assets/i1-Jri-U_l6.png" 
              alt="Shaheen Express Logo" 
              className="w-32 h-auto" 
            />
            <p className="text-sm tracking-wider">Fast and Reliable Cargo Services by Shaheen Express</p>
          </div>

          {/* Column 2: Information Links (NEW) */}
          <div className="space-y-4">
            <h3 className="text-xl tracking-wide">Explore</h3>
            <ul className="space-y-2 text-sm">
              {infoLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:opacity-75 transition-opacity">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Resources Links (NEW) */}
          <div className="space-y-4">
            <h3 className="text-xl tracking-wide">Resources</h3>
            <ul className="space-y-2 text-sm">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:opacity-75 transition-opacity">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div className="space-y-4">
            <h3 className="text-xl tracking-wide">Follow us</h3>
            <p className="text-sm">Follow us on social media</p>
            <div  className="flex items-center space-x-4">
              <a href="https://www.instagram.com/alshaheenexpress" className='ml-4' aria-label="Instagram"><Instagram size={20} /></a>
              <a href="https://www.facebook.com/alshaheenexpress" className='mr-10'  aria-label="facebook"><FaFacebookF size={20} /></a>
              <a href="https://x.com/shaheenexpress"  aria-label="x"><FaXTwitter size={20} /></a>
            </div>
            <p className="text-sm pt-2">SAT - THU 9am - 9pm</p>
          </div>

          {/* Column 5: eFada Image */}
          <div className="flex justify-start lg:justify-center">
            <a href="#" className="text-center">
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
          <p className="text-sm tracking-wide text-white font-semibold">
            © {new Date().getFullYear()} Shaheen Express
          </p>

          {/* Payment Icons */}
          <div className="flex items-center space-x-2">
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