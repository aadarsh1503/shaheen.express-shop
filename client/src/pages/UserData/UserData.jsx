import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Database,
  EyeOff,
  Server,
  FileCheck,
} from "lucide-react";

// Card component for the grid
const ProtectionCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="group relative bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Accent Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-dgreen/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="relative z-10">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-dgreen text-white mb-5">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-DarkBlue mb-3">{title}</h3>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export default function UserDataProtectionPolicy1() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-[#EC2027]">
      {/* Hero Section - Split Layout */}
      <header className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-center lg:text-left"
          >
            <h1 className="text-4xl lg:text-6xl font-poppins font-extrabold text-white">
              Data Protection <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                Guaranteed.
              </span>
            </h1>
            <p className="mt-6 text-gray-300 max-w-xl">
              We employ industry-leading measures to ensure your sensitive
              shipping information is always secure. Here is our commitment to
              protecting your data.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-dgreen blur-3xl opacity-30 rounded-full"></div>
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-8">
              <Shield size={80} className="text-yellow-300" />
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content - Grid */}
      <main className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-DarkBlue">
              How We Keep You Safe
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Our multi-layered approach to data security ensures compliance and
              peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProtectionCard
              icon={Lock}
              title="End-to-End Encryption"
              description="All sensitive data transmitted between your browser and our servers is protected using TLS 1.3 encryption, the gold standard for secure communications."
              delay={0.1}
            />

            <ProtectionCard
              icon={Database}
              title="Secure Storage"
              description="Your data is stored in secure, access-controlled databases. We use advanced firewall protection and intrusion detection systems."
              delay={0.2}
            />

            <ProtectionCard
              icon={EyeOff}
              title="Data Minimization"
              description="We only collect the data necessary to provide our logistics services. We never sell your personal information to third parties."
              delay={0.3}
            />

            <ProtectionCard
              icon={Server}
              title="Redundant Infrastructure"
              description="Our systems are built on a redundant cloud infrastructure, ensuring high availability and protecting against data loss due to hardware failure."
              delay={0.4}
            />

            <ProtectionCard
              icon={FileCheck}
              title="Regular Audits"
              description="We conduct periodic security audits and vulnerability assessments to identify and address potential risks proactively."
              delay={0.5}
            />

            <ProtectionCard
              icon={Shield}
              title="Access Controls"
              description="Strict role-based access controls (RBAC) ensure that only authorized personnel can access your shipment information."
              delay={0.6}
            />
          </div>

          {/* CTA Section */}
          {/* <div className="mt-20 bg-dgreen rounded-3xl p-10 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Have Security Questions?</h3>
            <p className="mb-6 opacity-90">
              If you wish to report a security vulnerability or have specific
              data concerns.
            </p>
            <a
              href="mailto:security@shaheen.express"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-DarkBlue font-bold px-8 py-3 rounded-lg transition"
            >
              Contact Security Team
            </a>
          </div> */}
        </div>
      </main>
    </div>
  );
}