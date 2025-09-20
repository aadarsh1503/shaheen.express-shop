import React from "react";
import i1 from "./i1.svg";
import i2 from "./i2.svg";
import { motion } from "framer-motion"; // Import motion from framer-motion

const HomeService = () => {
  return (
    <motion.section
      id="services"
      className="py-16 p-3 bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
    >
      <div className="text-center  mb-12">
        <h1 className="text-white mb-4">Hii</h1>
        <h3 className="text-dgreen font-bold uppercase tracking-wide text-sm mb-6">
          S E R V I C E
        </h3>
        <h2 className="text-2xl font-bold text-gray-800">
          What We Do To Help Your Business Grow
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        {/* Fulfillment Card */}
        <a href="/aboutUs">
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        >
          <img
            src={i2}
            alt="Fulfillment"
            className="mx-auto w-16 h-16"
          />
          <h3 className="mt-6 text-lg font-semibold text-gray-800">Fulfillment</h3>
          <p className="mt-3 text-gray-500 text-lg">
            Storing your products with assured QC and customized service
          </p>
        </motion.div>
        </a>
<a href="/manPower">
        {/* Delivery Card */}
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        >
          <img
            src={i1}
            alt="Delivery"
            className="mx-auto w-16 h-16"
          />
          <h3 className="mt-6 text-lg font-semibold text-gray-800">Delivery</h3>
          <p className="mt-3 text-gray-500 text-lg">
            Ship to your end customers in quickest time and at cheapest price
          </p>
        </motion.div>
        </a>
      </div>
    </motion.section>
  );
};

export default HomeService;
