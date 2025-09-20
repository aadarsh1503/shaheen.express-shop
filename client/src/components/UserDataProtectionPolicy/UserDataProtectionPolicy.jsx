// src/components/UserDataProtectionPolicy.js

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Dummy EmailSection component to make the code runnable


// Collapsible Section Component
const CollapsibleSection = ({ title, children, i }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      className="border border-slate-200 rounded-lg overflow-hidden mb-4 shadow-sm"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-slate-50 transition-colors"
      >
        <h3 className="font-semibold text-lg text-slate-800">{title}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-white text-slate-600 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const UserDataProtectionPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const policies = [
    {
      title: 'INTRODUCTION',
      content: (
        <>
          <p>This Privacy Notice explains how Shaheen Express obtains, stores, and protects Personal Data. It applies to all users of our applications, websites, and services.</p>
          <p className="mt-4">Please read this notice thoroughly to understand our data protection practices.</p>
        </>
      ),
    },
    {
        title: 'WHAT PERSONAL DATA DO WE PROCESS',
        content: (
          <>
            <h4 className="font-semibold text-slate-700 mb-2">1. Types of Personal Data</h4>
            <p>Personal Data means information that identifies an individual, including names, addresses, and phone numbers. We process Identity, Contact, and Location Data as necessary to provide our Services.</p>
            <h4 className="font-semibold text-slate-700 mt-4 mb-2">2. How We Collect Your Personal Data</h4>
            <p>The Personal Data we process is obtained directly from our Clients (the party engaging our services) or through inquiries submitted via our website and customer service channels.</p>
          </>
        ),
      },
      {
        title: 'HOW WE PROCESS YOUR PERSONAL DATA',
        content: (
          <>
            <h4 className="font-semibold text-slate-700 mb-2">Use of Personal Data</h4>
            <p>We use Personal Data to facilitate shipments, communicate with senders and recipients, provide customer service, and comply with legal obligations.</p>
            <h4 className="font-semibold text-slate-700 mt-4 mb-2">Sharing Personal Data</h4>
            <p>We may share data with affiliates, service providers, and government authorities when required by law or necessary to provide the Service.</p>
          </>
        ),
      },
      {
        title: 'HOW WE PROTECT YOUR PERSONAL DATA',
        content: (
            <p>The confidentiality of your Personal Data is paramount. We implement robust security measures to protect your data from unauthorized access, loss, or disclosure. While no internet transmission is 100% secure, we strive to use commercially acceptable means to protect your data.</p>
        ),
      },
      {
        title: 'CONTACT US',
        content: (
            <p>
                If you have questions regarding this Privacy Notice or wish to exercise your data rights, please contact us at{' '}
                <a href="mailto:info@shaheen.express" className="text-teal-600 font-medium hover:underline">
                    info@shaheen.express
                </a>.
            </p>
        ),
      },
  ];

  return (
    <div className="bg-slate-50">
      {/* Header Section */}
      <div className="bg-dgreen    h-72 w-full  flex items-center text-left  p-6 font-sans text-white py-20 px-6">
        <div className="max-w-6xl py-10 ">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:text-6xl lg:ml-20  ml-0 mt-16 text-4xl font-bold mb-2  tracking-tight">
            User Data Protection Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg lg:ml-20  ml-0 text-white">
            Your privacy is our priority.
          </motion.p>
        </div>
      </div>
      
      {/* Collapsible Sections */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {policies.map((policy, index) => (
            <CollapsibleSection key={index} title={policy.title} i={index}>
              {policy.content}
            </CollapsibleSection>
          ))}
        </div>
      </div>

      {/* Email Section */}
   
    </div>
  );
};

export default UserDataProtectionPolicy;