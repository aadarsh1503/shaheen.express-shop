// src/components/AboutUs.js

import React from 'react';
import { motion } from 'framer-motion';

// --- Using your specified image imports ---
import i1 from "./i1.jpg";
import i2 from "./i2.jpg";
import i3 from "./i3.jpg";
import i4 from "./i4.jpg";
import i5 from "./i5.jpg";
import i6 from "./i6.jpg";

// --- Dummy EmailSection (replace with your actual component) ---

// --- End of Dummy Component ---

const AboutUs = () => {
    // Array of features for cleaner mapping
  const features = [
    { title: "Pan Bahrain Coverage", description: "10 warehouses spread across different parts of Bahrain.", img: i1, align: "left" },
    { title: "Huge Storage Capacity", description: "Storage capacity ranging from 200K to more than 3 million items per warehouse.", img: i2, align: "right" },
    { title: "Regular Storage", description: "All items not requiring any special care can be stored here.", img: i6, align: "left" },
    { title: "High Value Storage", description: "High value storage to store highly valuable items with 24x7 security.", img: i4, align: "right" },
    { title: "Cold Storage", description: "Cold storage for items with low shelf life like dairy, pharmaceuticals, and beauty products.", img: i3, align: "left" },
    { title: "Pallet Storage", description: "Pallet storage to stack bulky products in dedicated areas.", img: i5, align: "right" },
  ];
  
  // Animation variants for staggered text
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };
  const textItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };


  return (
    <div className="bg-slate-100 text-slate-800">
      {/* --- THIS PART IS UNTOUCHED AS REQUESTED --- */}
      {/* Note: 'bg-dgreen' here will render as red based on your project's config */}
      <div className="bg-dgreen font-sans text-white py-10 px-5">
        <div className="max-w-6xl mt-0 lg:mt-20 mx-auto">
          <h1 className="lg:text-7xl text-4xl font-poppins font-bold mb-2">About Us</h1>
          <p className="text-base font-semibold tracking-wide text-red-200 mb-12">Commerce & Logistics Made Easy</p>
        </div>
      </div>
      {/* --- END OF UNTOUCHED PART --- */}

      {/* Introduction Section */}
      <div className="py-24 px-6 bg-slate-100">
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={textContainerVariants}
            className="max-w-4xl mx-auto text-center"
        >
          <motion.p variants={textItemVariants} className="text-xl md:text-2xl text-slate-700 leading-relaxed">
            Shaheen Express is not just a logistics company; we are architects of evolution. We move fast, shatter technological barriers, and forge lasting impacts for our customers.
          </motion.p>
        </motion.div>

        {/* Core Divisions with Glassmorphism Effect */}
        <div className="max-w-6xl mx-auto mt-20 grid md:grid-cols-2 gap-8">
            <DivisionCard 
                title="Fulfillment" 
                description="We store your products with assured QC and customized services across our 10 warehouses in Bahrain, ensuring your inventory is safe, managed, and ready for dispatch."
                icon={<IconBox />}
            />
            <DivisionCard 
                title="Delivery" 
                description="As a logistics aggregator, we provide affordable and reliable delivery services by leveraging our own fleet and partner networks to ensure the cheapest prices and fastest speeds."
                icon={<IconTruck />}
            />
        </div>
      </div>

      {/* Features Showcase Section */}
      <div className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-28">
            {features.map((feature, index) => (
                <FeatureShowcase key={index} {...feature} />
            ))}
        </div>
      </div>


    </div>
  );
};

// --- Reusable Sub-Components for a Cleaner, More Professional Structure ---

const DivisionCard = ({ icon, title, description }) => (
    <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} // A slick ease
        className="bg-white/60 p-8 rounded-2xl shadow-xl backdrop-blur-lg border border-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
    >
        <div className="flex items-center gap-4 mb-4">
            <div className="text-red-600">{icon}</div>
            <h3 className="text-3xl font-bold text-slate-900">{title}</h3>
        </div>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
);

const FeatureShowcase = ({ title, description, img, align }) => {
    const isRightAlign = align === 'right';

    const imageVariants = {
        hidden: { opacity: 0, x: isRightAlign ? 100 : -100, scale: 0.9 },
        visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } }
    };

    const textVariants = {
        hidden: { opacity: 0, x: isRightAlign ? -100 : 100 },
        visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.2, delayChildren: 0.2, duration: 0.8, ease: 'easeOut' } }
    };
    
    const textItem = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className={`grid md:grid-cols-5 items-center gap-10 md:gap-16`}
        >
            {/* Image Container */}
            <motion.div variants={imageVariants} className={`md:col-span-3 ${isRightAlign ? 'md:order-last' : ''}`}>
                <div className="p-2 bg-gradient-to-br from-red-500 to-orange-400 rounded-2xl shadow-2xl shadow-red-500/20">
                    <img src={img} alt={title} className="rounded-xl w-full h-96 object-cover transform hover:scale-105 transition-transform duration-700 ease-in-out"/>
                </div>
            </motion.div>

            {/* Text Container */}
            <motion.div variants={textVariants} className={`md:col-span-2 ${isRightAlign ? 'md:text-right' : ''}`}>
                <motion.h2 variants={textItem} className="text-4xl md:text-5xl font-bold text-red-600 tracking-tight">
                    {title}
                </motion.h2>
                <motion.p variants={textItem} className="mt-4 text-lg text-slate-600">
                    {description}
                </motion.p>
            </motion.div>
        </motion.div>
    );
};


// --- SVG Icons for a futuristic feel ---
const IconBox = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconTruck = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16l2 2h2.5a1 1 0 001-.828l1.48-6.374a1 1 0 00-.986-1.172H17m-4-8l-4 4m0 0l4 4m-4-4h12" /></svg>;

export default AboutUs;