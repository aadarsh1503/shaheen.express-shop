import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- STEP 1: ONLY IMPORT THE IMAGE YOU NEED ---
import i6 from "./i6.jpg";

// A sleek, futuristic chevron icon component (No changes here)
const ChevronIcon = ({ isOpen }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    animate={{ rotate: isOpen ? 180 : 0 }}
    transition={{ duration: 0.3 }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </motion.svg>
);

const EmailSection = () => {
  // Dropdown logic remains the same
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const topics = [
    { label: "Customer Care", email: "ask@shaheen.express" },
    { label: "Seller Support", email: "contact@shaheen.express" },
    { label: "Business Enquiries", email: "info@shaheen.express" },
  ];

  // --- STEP 2: REMOVE ALL CAROUSEL-RELATED STATE AND EFFECTS ---
  // const images = [ i2, i3, i6]; // No longer needed
  // const [currentImage, setCurrentImage] = useState(0); // No longer needed
  // useEffect(...); // No longer needed

  // Animation variants for the dropdown menu (No changes here)
  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { staggerChildren: 0.1, duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };
  const itemVariants = { hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } };

  return (
    <motion.section
      className="bg-white text-black min-h-[700px] md:min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="relative grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto w-full items-center">

        {/* Text content section (No changes here) */}
        <motion.div
          className="relative z-10 col-start-1 md:col-span-1"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
            Ignite Your Growth.
            <br />
            Let's build the <span className="text-[#EC2027]">future.</span>
          </h2>
          <p className="mt-6 text-lg text-gray-500 max-w-lg">
            Your next chapter starts with a conversation. Connect with the visionaries ready to propel you forward.
          </p>
          <div className="relative mt-10 w-full max-w-sm">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between p-4 bg-black text-white rounded-md text-lg font-semibold transition-all duration-300 ease-in-out hover:bg-[#EC2027] focus:outline-none focus:ring-4 focus:ring-[#EC2027]/50"
            >
              <span>Connect With Us</span>
              <ChevronIcon isOpen={dropdownOpen} />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                  className="absolute mt-2 w-full bg-white rounded-md shadow-2xl z-20 overflow-hidden border border-gray-200"
                >
                  {topics.map((topic, index) => (
                    <motion.a key={index} href={`mailto:${topic.email}`} variants={itemVariants}
                      className="block px-5 py-3 text-gray-800 font-medium transition-colors duration-200 hover:bg-[#EC2027] hover:text-white hover:pl-6"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {topic.label}
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* The Image Section (MODIFIED) */}
        <div className="absolute inset-0 md:relative w-full h-full col-start-1 md:col-start-2 col-span-1 flex items-center justify-center">
            <motion.div
                className="relative w-full max-w-xl h-full"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
                {/* The Red Glow Effect */}
                <div className="absolute -inset-4 bg-[#EC2027] rounded-full blur-3xl opacity-20"></div>
                
                {/* --- STEP 3 & 4: DISPLAY THE SINGLE IMAGE --- */}
                {/* AnimatePresence is removed, and the src is set directly */}
                <img
                    src={i6}
                    alt="Futuristic business visuals"
                    className="relative w-full h-[300px] md:h-[500px] object-cover rounded-2xl shadow-2xl z-10"
                />
            </motion.div>
        </div>

      </div>
    </motion.section>
  );
};

export default EmailSection;