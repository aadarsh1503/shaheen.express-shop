import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

// Small local EmailSection placeholder so this file runs standalone.


// Collapsible section component (accessible)
const Collapsible = ({ id, title, children, openByDefault=false }) => {
  const [open, setOpen] = useState(openByDefault);

  useEffect(()=>{
    // close on mount if on mobile? placeholder for any side effects
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto mb-4">
      <button
        onClick={()=>setOpen(o=>!o)}
        aria-expanded={open}
        aria-controls={"section-"+id}
        className="w-full bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 rounded-xl px-4 py-3 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
            <ShieldCheck size={18} className="text-dgreen" />
          </div>
          <h4 className="text-left text-dgreen font-bold text-sm lg:text-lg">{title}</h4>
        </div>
        <div className="text-dgreen">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={"section-"+id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32 }}
            className="overflow-hidden bg-white rounded-b-xl border border-t-0 border-yellow-100 shadow-sm"
          >
            <div className="p-6 text-start text-sm leading-7 text-gray-700">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Privacy Policy component
export default function PrivacyPolicy1() {
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-DarkBlue text-gray-900">
      {/* Hero */}
      <header className="bg-gradient-to-r from-dgreen to-[#0b6b5a] text-white py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-6xl font-poppins font-extrabold leading-tight">Privacy Policy</h1>
            <p className="mt-4 text-sm lg:text-base max-w-2xl opacity-90">Your privacy matters. This policy explains how Shaheen Express collects, uses, and protects information when providing shipping, fulfillment and logistics services.</p>
            {/* <div className="mt-6 flex gap-3">
              <a href="#contact" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md">Contact us</a>
              <a href="#summary" className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-md text-dgreen">Quick summary</a>
            </div> */}
          </div>
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <p className="text-sm font-semibold text-dgreen">Safe & Secure</p>
              <p className="text-xs text-gray-600 mt-2">We act as a data processor for our clients — shipping and logistics data is handled according to client instructions & applicable law.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Sections container */}
      <main className="py-14 px-6">
        <section className="max-w-6xl mx-auto">

          {/* Intro */}
          <Collapsible id={1} title="Introduction" openByDefault>
            <p>
              This Privacy Notice explains how Shaheen Express and its affiliates obtain, collect, store, use, process, analyze, correct, update, display, disclose, transfer and protect personal data in connection with our website, mobile apps and the Services we provide.
            </p>
            <p className="mt-3">
              It applies to all users, clients, senders and recipients involved in delivery, fulfillment and goods transportation provided by Shaheen Express.
            </p>
          </Collapsible>

          {/* Summary */}
          <Collapsible id={2} title="Summary - Quick Facts">
            <div className="space-y-3">
              <div>
                <p className="font-semibold">What data do we process?</p>
                <p className="text-sm">Only the personal data needed to deliver the service (names, addresses, contact numbers, shipment details, location data when required).</p>
              </div>

              <div>
                <p className="font-semibold">How do we use it?</p>
                <p className="text-sm">To facilitate shipments, communicate status updates, handle queries, and comply with legal obligations.</p>
              </div>

              <div>
                <p className="font-semibold">Who do we share it with?</p>
                <p className="text-sm">With clients who instruct us, logistics partners, and third parties where required to provide the service or by law.</p>
              </div>

              <div>
                <p className="font-semibold">Retention</p>
                <p className="text-sm">We retain personal data only as long as needed for the service and legal requirements or as instructed by our clients.</p>
              </div>
            </div>
          </Collapsible>

          {/* Personal Data */}
          <Collapsible id={3} title="What Personal Data We Process">
            <div className="space-y-3">
              <p className="font-semibold">Types of Personal Data</p>
              <p className="text-sm">Identity data (names), contact data (addresses, phone numbers), location data (delivery location, coordinates), and shipment details.</p>

              <p className="font-semibold mt-4">Incomplete data from clients</p>
              <p className="text-sm">If clients provide incomplete or inaccurate data we process what we receive and may be unable to perform the requested service.
              Clients are responsible for verifying accuracy of the data provided to us.</p>

              <p className="font-semibold mt-4">How we collect data</p>
              <p className="text-sm">Primarily from our clients and via customer inquiries submitted on the website or email.</p>
            </div>
          </Collapsible>

          {/* Processing */}
          <Collapsible id={4} title="How We Process Your Personal Data">
            <div className="space-y-3">
              <p className="font-semibold">Purposes of processing</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>To deliver shipments and fulfill orders per client instructions.</li>
                <li>To communicate with senders, recipients, and clients.</li>
                <li>To notify users of updates and handle inquiries and complaints.</li>
                <li>To comply with legal and regulatory obligations.</li>
                <li>To detect and prevent fraud, abuse or criminal activity.</li>
              </ul>

              <p className="font-semibold mt-4">Sharing</p>
              <p className="text-sm">We may share data with affiliates, carriers, insurance providers and other third parties strictly to provide the service or when required by law.</p>

              <p className="font-semibold mt-4">Storage</p>
              <p className="text-sm">Data is retained as long as necessary for the service, legal compliance or per client instructions. When no longer required, we anonymize or delete it.</p>

              <p className="font-semibold mt-4">Where we process</p>
              <p className="text-sm">Processing may occur in multiple countries. We use reasonable measures to ensure third-party processors provide comparable protection.</p>
            </div>
          </Collapsible>

          {/* Protection */}
          <Collapsible id={5} title="How We Protect Your Data">
            <div className="space-y-3">
              <p className="font-semibold">Security</p>
              <p className="text-sm">We implement organizational and technical safeguards to protect personal data from unauthorized access, loss or misuse. However, no internet transmission is 100% secure.</p>

              <p className="font-semibold mt-4">Anonymized & aggregated data</p>
              <p className="text-sm">We may use aggregated or anonymized datasets for analytics, product improvement and lawful business purposes.</p>
            </div>
          </Collapsible>

          {/* Rights */}
          <Collapsible id={6} title="Your Rights">
            <div className="space-y-3">
              <p className="font-semibold">Access & correction</p>
              <p className="text-sm">Senders and recipients may have rights under applicable laws to access, correct or request deletion of their personal data. Often these requests should be made to the client who collected the data; we will assist when instructed by the client.</p>

              <p className="font-semibold mt-4">Limitations</p>
              <p className="text-sm">We may refuse certain requests where permitted by law (e.g., if it affects other individuals, or is frivolous or abusive).</p>
            </div>
          </Collapsible>

          {/* Misc & Contact */}
          <Collapsible id={7} title="Miscellaneous & Changes">
            <div>
              <p className="text-sm">We may update this Privacy Notice occasionally to reflect changes in law, technology, or our services. Material changes will be published on our website.</p>
              <p className="text-sm mt-3">For questions, requests or concerns regarding this Privacy Notice, please contact us at <a id="contact" href="mailto:info@shaheen.express" className="text-dgreen underline">info@shaheen.express</a>.</p>
            </div>
          </Collapsible>

          {/* Extra: quick links for accessibility */}
          {/* <div className="max-w-5xl mx-auto mt-8 flex flex-col sm:flex-row gap-3 justify-between">
            <a href="#" className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm">Download PDF</a>
            <a href="#contact" className="px-4 py-3 rounded-lg bg-dgreen text-white text-sm flex items-center gap-2"><Mail size={16}/> Contact Support</a>
          </div> */}

          {/* Email / CTA */}
          {/* <EmailSection /> */}

        </section>
      </main>

      {/* <footer className="py-10">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">© {new Date().getFullYear()} Shaheen Express. All rights reserved.</div>
      </footer> */}
    </div>
  );
}

/*
 Tailwind color tokens used in the component (add to your tailwind config):
 {
   colors: {
     dgreen: '#0b6b5a',
     DarkBlue: '#0f1724',
     // Yellow variants already used in classes above
   }
 }
*/