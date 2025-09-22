import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Package, RotateCcw, CheckCircle, Clock, Truck } from "lucide-react";

// Helper component for the steps
const ReturnStep = ({ step, title, description, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: step * 0.2 }}
      className="relative flex gap-6 pb-12"
    >
      {/* Timeline Line (except for the last item) */}
      <div className="absolute left-6 top-10 h-full w-0.5 bg-yellow-200"></div>

      {/* Icon Circle */}
      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-yellow-50 border-2 border-yellow-300 shadow-md">
        <Icon className="h-6 w-6 text-dgreen" />
      </div>

      {/* Content Card */}
      <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <span className="text-sm font-bold text-yellow-600">STEP {step}</span>
        <h3 className="mt-2 text-xl font-semibold text-gray-900">{title}</h3>
        <div className="mt-3 text-gray-600 leading-relaxed">{description}</div>
      </div>
    </motion.div>
  );
};

export default function ReturnRefundPolicy12() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section - Centered */}
      <header className="bg-[#EC2027] text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <RotateCcw size={48} className="mx-auto mb-4 text-yellow-300" />
          <h1 className="text-4xl lg:text-5xl font-poppins font-extrabold">
            Return & Refund Policy
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Our straightforward process for returns, refunds, and replacements at
            Shaheen Express.
          </p>
        </div>
      </header>

      {/* Main Content - Timeline */}
      <main className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <p className="text-sm text-gray-700">
              <strong>Timeframe:</strong> You have 14 days from the delivery date
              to request a return. Items must be unused and in original
              packaging.
            </p>
          </div>

          {/* Steps */}
          <ReturnStep
            step={1}
            title="Initiate Your Return"
            description={
              <p>
                Log in to your account or contact our support team at{" "}
                <a href="mailto:contact@shaheen.express" className="text-dgreen font-medium">
                contact@shaheen.express
                </a>{" "}
                to start the process. Provide your tracking number and reason
                for return.
              </p>
            }
            icon={Package}
          />

          <ReturnStep
            step={2}
            title="Receive Authorization & Label"
            description="Once approved, we will email you a Return Merchandise Authorization (RMA) number and a prepaid shipping label (if applicable). Please print and attach the label."
            icon={CheckCircle}
          />

          <ReturnStep
            step={3}
            title="Ship the Item Back"
            description="Drop off the package at the designated carrier location within 7 days of receiving your label. Ensure the item is securely packed."
            icon={Truck}
          />

          <ReturnStep
            step={4}
            title="Inspection & Refund"
            description={
              <div>
                <p>
                  Upon arrival at our facility, we inspect the item (usually 3-5
                  business days).
                </p>
                <p className="mt-2">
                  If approved, the refund will be processed to your original
                  payment method.
                </p>
              </div>
            }
            icon={Clock}
          />
        </div>
      </main>
    </div>
  );
}