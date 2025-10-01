// src/pages/MyAccountPage/LogoutAnimation.js

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap } from 'lucide-react'; // Using a futuristic 'Zap' or 'CheckCircle' icon

const LogoutAnimation = ({ onAnimationComplete }) => {

  // This effect will run after the component has animated in
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete(); // This will trigger the actual logout logic
    }, 1800); // Wait 1.8 seconds before logging out

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onAnimationComplete]);


  // Variants for the main modal container
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -100 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 120,
        damping: 15,
        when: "beforeChildren", // Animate children after parent
        staggerChildren: 0.2, // Stagger children animations
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.7, 
      y: 100,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  // Variants for the children elements (icon, text)
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };


  return (
    // AnimatePresence is crucial for the exit animation to work
    <AnimatePresence>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 text-center w-full max-w-md m-4"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
              {/* The "sexy" animated icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-[#EC2027] to-[#EC2027] shadow-lg"
              >
                <CheckCircle size={60} className="text-white" strokeWidth={1.5} />
              </motion.div>
            </motion.div>

            <motion.h2 
              variants={itemVariants} 
              className="text-4xl font-bold text-gray-800 mb-3"
            >
              See You Soon!
            </motion.h2>

            <motion.p 
              variants={itemVariants} 
              className="text-gray-600 text-lg"
            >
              You have been successfully logged out.
            </motion.p>
          </motion.div>
        </div>
    </AnimatePresence>
  );
};

export default LogoutAnimation;