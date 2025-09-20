import React, { useEffect, useRef, useState } from "react"; // Import useState

import { motion } from "framer-motion";
import HomeService from "./HomeService";
import LogisticsSection from "./LogisticsSection";
import EmailSection from "./EmailSection";
import ClientsSection from "./ClientsSection";
import Partners from "./Partners";
import Testimonials from "../Testimonials/Testimonials";

// --- Reusable Component for Scroll Animations ---
const ScrollAnimatedSection = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 75 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// --- Main Hero Component ---
const Hero = () => {
  const cardRef = useRef(null);
  const videoURL = "https://ik.imagekit.io/cviw7sztp/shaheen-express/3840442-uhd_2560_1440_30fps%20(1)%20(1)%20(1)%20(1).mp4?updatedAt=1753184340861";

  // --- FALLBACK IMAGE SETUP ---
  // 1. Add a URL for your fallback image. A high-quality screenshot from the video is a good choice.
  const fallbackImageURL = "https://ik.imagekit.io/cviw7sztp/shaheen-express/Screenshot%202025-07-22%20172354.png?updatedAt=1753185262959"; // <-- REPLACE WITH YOUR ACTUAL IMAGE URL
  
  // 2. State to track if the video has an error
  const [videoHasError, setVideoHasError] = useState(false);

  // 3. Handler function to set the error state to true
  const handleVideoError = () => {
    // This function will be called if the video fails to load
    setVideoHasError(true);
  };


  // --- AURORA BORDER EFFECT ---
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  // --- Animation Variants ---
  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.4, 0.0, 0.2, 1],
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const textLineVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] },
    },
  };
  
  const headingLines = ["The Key to Your", "Seamless Logistics", "Experience"];

  return (
    <>
      {/* --- Hero Section --- */}
      <div className="relative font-poppins bg-dgreen overflow-hidden">
        {/* --- Background: Conditionally render Video or Fallback Image --- */}
        {videoHasError ? (
          // IF VIDEO FAILS, RENDER THIS IMAGE BACKGROUND
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${fallbackImageURL})` }}
          >
             <div className="absolute inset-0 bg-dgreen/60 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
          </div>
        ) : (
          // IF VIDEO WORKS, RENDER THE VIDEO
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              poster={fallbackImageURL} // 4. Use image as a poster
              onError={handleVideoError}  // 5. Call handler on error
            >
              <source src={videoURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-dgreen/60 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
          </motion.div>
        )}
        
        <motion.section
          className="relative z-10 flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen"
        >
          {/* Aurora Card */}
          <motion.div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="group mt-0 lg:mt-16 relative text-center text-white rounded-2xl shadow-2xl w-full max-w-3xl"
            style={{
              background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.2), transparent 80%)`
            }}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="p-8 sm:p-12  rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg transition-all duration-300 group-hover:bg-white/10">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter" style={{ textShadow: '0px 2px 15px rgba(0, 0, 0, 0.5)' }}>
                {headingLines.map((line, index) => (
                  <div key={index} className="overflow-hidden py-1">
                    <motion.div variants={textLineVariants}>{line}</motion.div>
                  </div>
                ))}
              </h1>
              <div className="overflow-hidden mt-10">
                <motion.div variants={textLineVariants}>
                  <motion.a
                    href="/aboutUs"
                    className="inline-block"
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button className="bg-white text-dgreen font-semibold text-lg py-5 px-10 rounded shadow-lg hover:bg-dgreen hover:text-white transition-all duration-300 hover:outline hover:outline-2 hover:outline-white hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                      LEARN MORE
                    </button>
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>

      {/* --- Other Sections --- */}
      <HomeService />
      
      <LogisticsSection />
  
      <ClientsSection />
   
      <Partners />
  
      <Testimonials />
   
      <EmailSection />
    </>
  );
};

export default Hero;