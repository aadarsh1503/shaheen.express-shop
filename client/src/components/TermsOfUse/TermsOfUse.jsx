// src/components/TermsOfUse.js

import React from 'react';
import { motion } from 'framer-motion';

// Dummy EmailSection component to make the code runnable



const TermsOfUse = () => {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="bg-dgreen  text-white py-10  h-72 w-full flex items-center  p-6 font-sans text-white py-20 px-6">
        <div className="max-w-6xl lg:ml-20 ml-0">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:text-6xl  text-4xl font-bold mb-2 tracking-tight">
            Terms of Use
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-white">
            The following terms and conditions govern your use of our services.
          </motion.p>
        </div>
      </div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="p-6 lg:p-12"
      >
        <div className="max-w-4xl font-sans leading-relaxed text-gray-700 mb-10 mx-auto">
          
          <Section title="A. Definitions">
            <PolicyItem term="User" definition="refers to the party utilizing Shaheen Express's delivery services." />
            <PolicyItem term="Sender" definition="is a registered User who sends Goods to other Users." />
            <PolicyItem term="Buyer" definition="is a registered User requesting the delivery of Goods." />
            <PolicyItem term="Shaheen Express" definition="refers to PT Swift Shipment Solutions, the company providing delivery services for Goods." />
            <PolicyItem term="Courier" definition="is a third-party partner collaborating with Shaheen Express to deliver and pick up Goods for Users." />
            <PolicyItem term="Delivery" definition="with Shaheen Express refers to the delivery of Goods managed by Shaheen Express, where pick-up and delivery activities are performed by Couriers recommended by Shaheen Express to facilitate the User’s shipping process." />
            <PolicyItem term="Goods" definition="refers to tangible items that meet the criteria for shipment by delivery service companies." />
            <PolicyItem term="Successful Delivery" definition="occurs when the Buyer confirms receipt of the Goods or the Courier successfully delivers the Goods to the Buyer's address." />
            <PolicyItem term="Terms and Conditions" definition="refer to the terms and conditions for Delivery with Shaheen Express." />
          </Section>

          <Section title="B. General">
            <p className="mb-4">1- By using Delivery with Shaheen Express, the User understands and agrees to grant Shaheen Express the right and authority to recommend and choose an appropriate Courier for the pick-up and delivery of Goods.</p>
            <p>2- Users can track the shipping status of Goods via <a href="https://shaheen.express/tracking-Form" className="text-teal-600 hover:underline">Link</a></p>
          </Section>

          <Section title="C. Shipping Terms">
            <p className="mb-4">1- For every item to be shipped, the Courier is entitled to receive information from the Sender, including the recipient's name, complete delivery address, and a clear description of the Goods.</p>
            <p className="mb-4">2- Delivery with Shaheen Express is available in certain regions in Bahrain with a maximum product weight of 50 kg. The maximum dimensions for packages are 50 cm x 50 cm x 50 cm.</p>
            <p className="mb-4">3- Weight is calculated based on the greater of actual or volumetric weight. The volumetric weight formula is (Length x Width x Height) / 6000.</p>
            <p className="mb-4">4- The Courier responsible for pick-up may differ from the Courier delivering the Goods.</p>
            <p className="mb-4">5- Senders are responsible for adequately packaging Goods. Couriers may refuse to pick up inadequately packaged items.</p>
            <p className="mb-4">6- Uninsured shipments are eligible for compensation up to 10 times the shipping cost or a maximum of BHD 1,000,000, whichever is lower.</p>
          </Section>

          <Section title="D. Data Usage">
            <p className="mb-4">1- The security of personal data is crucial. Shaheen Express employs security standards to protect this data and ensures it is used solely for delivery purposes as outlined in Shaheen Express’s Privacy Policy.</p>
            <p>2- Users authorize Shaheen Express to store, share, and transmit data related to delivery services to partner Couriers for operational purposes. Refer to Shaheen Express’s Privacy Policy for details.</p>
          </Section>
        </div>
      </motion.div>
      
    </div>
  );
};

// Helper components for structure and styling
const Section = ({ title, children }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-semibold text-teal-600 border-b-2 border-teal-200 pb-2 mb-6">{title}</h2>
    {children}
  </div>
);

const PolicyItem = ({ term, definition }) => (
  <p className="mb-4">
    <span className="font-bold text-gray-800">{term}:</span> {definition}
  </p>
);

export default TermsOfUse;