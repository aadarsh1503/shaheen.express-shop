// FuturisticLogisticsSection.js (using external CSS)

import React from "react";
import { motion } from "framer-motion";
import "./l.css"; // Your CSS file with the new styles

// Import your icons
import i3 from "./i3.svg";
import i4 from "./i4.svg";
import i5 from "./i5.svg";
import i6 from "./i6.svg";
import i7 from "./i7.svg";
import i8 from "./i8.svg";

const features = [
  { icon: i3, title: "Marketplace Integration", description: "Seamlessly connect with major marketplaces to sync your entire operation." },
  { icon: i4, title: "99.99% Stock Accuracy", description: "Our WMS ensures near-perfect inventory tracking, eliminating stockouts." },
  { icon: i6, title: "Real-Time Dashboard", description: "Monitor inventory, track deliveries, and gain insights with a live data feed." },
  { icon: i5, title: "Same Day Fulfillment", description: "Ultra-fast order processing and 3-day delivery coverage all across Bahrain." },
  { icon: i7, title: "Unified Order Management", description: "Manage orders end-to-end across multiple partners through a single interface." },
  { icon: i8, title: "Dedicated Support Team", description: "An expert Tracer and Customer Service team is always ready to assist you." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const FuturisticLogisticsSection = () => {
  return (
    <section id="why-us" className="bg-gray-100/50 py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h3 className="font-semibold text-dgreen text-base tracking-widest uppercase">
            Why Us?
          </h3>
          <h2 className="mt-4 text-4xl pb-2 sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700">
            The Future of Your Logistics
          </h2>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
                borderColor: "#EC2027",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              // --- MODIFICATION: Added 'animated-blur-bg' class ---
              className="group animated-blur-bg bg-white/70 backdrop-blur-md p-8 rounded-2xl border-2 border-transparent transition-colors duration-300 flex flex-col items-center text-center"
              // NOTE: The 'relative' and 'overflow-hidden' classes are now handled by 'animated-blur-bg', but it's fine to leave them for clarity.
            >
              <div
                className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-brand-red/10 to-transparent running-glint-effect"
                style={{
                  animationDelay: `${index * 0.3}s`,
                }}
              />

              {/* Your existing z-10 container will keep content on top of the new blur effect */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner mb-6">
                  <div className="absolute inset-0 rounded-full bg-brand-red opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-10 h-10"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FuturisticLogisticsSection;