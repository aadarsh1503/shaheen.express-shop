import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, AlertTriangle, Gavel } from "lucide-react";

// Section component for the main content
const TermsSection = ({ id, title, children }) => {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <Gavel className="text-dgreen" size={24} />
        <h2 className="text-2xl font-bold text-DarkBlue">{title}</h2>
      </div>
      <div className=" prose prose-slate max-w-none">
        {children}
      </div>
    </section>
  );
};

export default function TermsOfUse1() {
  const [activeSection, setActiveSection] = useState("");
  const observer = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Intersection Observer for the sticky nav highlighting
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.current.observe(section);
    });

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  const navItems = [
    { id: "acceptance", label: "Acceptance of Terms" },
    { id: "changes", label: "Changes to Terms" },
    { id: "services", label: "Use of Services" },
    { id: "restrictions", label: "Restrictions" },
    { id: "liability", label: "Limitation of Liability" },
  ];

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="bg-[#EC2027] shadow-md  top-0 z-50">
        <div className="max-w-7xl mx-auto py-4 px-6 flex items-center">
          <FileText className="text-yellow-300 mr-3" size={28} />
          <h1 className="text-white text-xl font-bold">Terms of Use</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:w-1/4">
            <nav className="sticky top-24 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 uppercase tracking-wider mb-4">
                On This Page
              </h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`block py-2 px-3 rounded-md transition-colors ${
                        activeSection === item.id
                          ? "bg-yellow-100 text-dgreen font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Warning Box */}
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="text-yellow-600 mb-2" size={20} />
                <p className="text-xs text-gray-700">
                  Please read these terms carefully before using Shaheen Express
                  services.
                </p>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 lg:p-12 rounded-xl shadow-sm border border-gray-200"
            >
              <p className="text-gray-600 mb-8">Last Updated: October 26, 2023</p>

              <TermsSection id="acceptance" title="1. Acceptance of Terms">
                <p>
                  By accessing or using the services provided by Shaheen Express
                  (the "Service"), you agree to be bound by these Terms of Use
                  ("Terms"). If you do not agree to these Terms, do not use the
                  Service.
                </p>
              </TermsSection>

              <TermsSection id="changes" title="2. Changes to Terms">
                <p>
                  We reserve the right to modify these Terms at any time. We
                  will always post the most current version on our website. By
                  continuing to use the Service after changes are posted, you
                  agree to the revised Terms.
                </p>
              </TermsSection>

              <TermsSection id="services" title="3. Use of Services">
                <p>
                  You must be at least 18 years old to use our services. You
                  agree to provide accurate and complete information when
                  registering and placing orders.
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                  <li>You are responsible for maintaining the confidentiality of your account.</li>
                  <li>You are responsible for all activities under your account.</li>
                  <li>You must comply with all applicable laws and regulations.</li>
                </ul>
              </TermsSection>

              <TermsSection id="restrictions" title="4. Restrictions">
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700">
                  <li>Use the Service for any unlawful purpose.</li>
                  <li>Ship prohibited items (e.g., hazardous materials, illegal goods).</li>
                  <li>Interfere with or disrupt the integrity of the Service.</li>
                  <li>Reverse engineer any aspect of the Service.</li>
                </ul>
              </TermsSection>

              <TermsSection id="liability" title="5. Limitation of Liability">
                <p>
                  Shaheen Express shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages,
                  including without limitation, loss of profits, data, use,
                  goodwill, or other intangible losses, resulting from your
                  access to or use of or inability to access or use the Service.
                </p>
              </TermsSection>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}