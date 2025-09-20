// src/components/ReturnAndRefundPolicy.js

import React from 'react';
import { motion } from 'framer-motion';

const ReturnAndRefundPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-dgreen  text-white py-10  h-72 w-full flex items-center  p-6">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-left ml-0 lg:ml-12"
        >
          <h1 className="text-4xl md:text-6xl mt-20  font-bold text-white tracking-tight">
            Return & Refund Policy
          </h1>
          <p className="text-white mt-2 text-lg">
            Hassle-free returns to ensure your satisfaction.
          </p>
        </motion.div>
      </div>

      {/* Policy Content */}
      <div className="px-4 mt-20">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12"
        >
          <PolicySection title="Overview">
            <p>
              Our Return & Refund Policy provides protection for our customers. This policy outlines the conditions under which returns are accepted and how refunds are processed. We are committed to ensuring a fair and transparent process for all claims related to damaged, incorrect, or lost shipments.
            </p>
          </PolicySection>

          <PolicySection title="Eligibility for a Refund">
            <p>To be eligible for a return or refund, you must meet the following criteria:</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>The claim must be initiated within <strong>7 days</strong> of the successful delivery date.</li>
              <li>You must provide clear photographic or video evidence of the damage or issue.</li>
              <li>The item must be in its original packaging, as received.</li>
              <li>For lost items, a claim can be filed after the shipment has not been updated for 10 consecutive days.</li>
            </ul>
          </PolicySection>
          
          <PolicySection title="How to Initiate a Return">
            <p>
              To start the return process, please contact our support team at{' '}
              <a href="mailto:support@shaheen.express" className="text-teal-600 font-medium hover:underline">
                support@shaheen.express
              </a> with the following information:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Your tracking number.</li>
              <li>A detailed description of the issue.</li>
              <li>Supporting evidence (photos/videos).</li>
            </ul>
            <p className="mt-4">Our team will review your request and guide you through the next steps within 2 business days.</p>
          </PolicySection>

          <PolicySection title="Refunds Process">
            <p>
              Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment or provided as service credit within 5-7 business days.
            </p>
          </PolicySection>

          <PolicySection title="Non-Returnable Items">
            <p>
              Certain types of items cannot be returned, including:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Hazardous materials or flammable liquids/gases.</li>
              <li>Perishable goods.</li>
              <li>Items shipped without adequate packaging by the sender.</li>
            </ul>
          </PolicySection>
        </motion.div>
      </div>
    </div>
  );
};

// Helper component for section styling
const PolicySection = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">
      {title}
    </h2>
    <div className="text-gray-600 leading-relaxed">
      {children}
    </div>
  </section>
);

export default ReturnAndRefundPolicy;