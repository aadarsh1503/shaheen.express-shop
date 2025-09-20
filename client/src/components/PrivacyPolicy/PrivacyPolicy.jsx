import React, { useState } from 'react';
import EmailSection from '../Hero/EmailSection';
import { motion } from "framer-motion";
import { useEffect } from 'react';
// Collapsible Section Component
const CollapsibleSection = ({ title, description }) => {
  useEffect(() => {
    // Scroll to the top of the page on mount
    window.scrollTo(0, 0);
  }, []);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-DarkBlue ">
      <div className="font-roboto lg:max-w-5xl bg-white mx-auto mb-4">
        {/* Header */}
        <div
          className="flex bg-YellowLight lg:px-4 outline-white border outline-1 lg:w-[1032px] lg:py-2 cursor-pointer items-center"
          onClick={toggleSection}
        >
          <div className="text-2xl lg:mr-4 mr-5">{isOpen ? '-' : '▼'}</div>
          <div className="font-bold text-dgreen text-sm lg:text-xl">{title}</div>
        </div>
        {/* Content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'h-full' : 'max-h-0'
          }`}
        >
          {isOpen && (
            <div className="text-start lg:mt-4 lg:px-8 border-yellow-400">
              <div className="p-4 font-roboto">{description}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PrivacyPolicy = () => {
  return (
    <div>
      {/* Header Section */}
      <div className="bg-dgreen font-sans text-white py-10 px-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="lg:text-7xl mt-20 lg:mt-20 text-2xl font-poppins font-bold mb-2">
            Privacy Policy
          </h1>
        </div>
      </div>
      
      {/* Collapsible Sections */}
      <div className="py-20 bg-DarkBlue font-roboto">
      <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-center"
        >
  <CollapsibleSection
    title="INTRODUCTION"
    description={
      <>
        <p>
          This Privacy Notice explains how we, Shaheen Express and/or its affiliates ("Shaheen Express") obtain, collect, store, control, use, process, analyze, correct, update, display, disclose, transfer, reveal, and protect Personal Data processed by Shaheen Express ("Personal Data Processing").
        </p>
        <br />
        <p>
          This Privacy Notice applies to all users of the mobile application and/or website and services, including but not limited to delivery services with SHAHEEN EXPRESS and the fulfillment of goods orders, goods delivery services, and purchase of goods orders ("Services").
        </p>
        <br />
        <p>
          This Privacy Notice is provided in a layered format so you can click on specific areas available below. Please read this Privacy Notice thoroughly to ensure that you understand our data protection practices. For ease of understanding, we have summarized the key points in the summary section. Unless otherwise specified, all capitalized terms used in this Privacy Notice will have the same meaning as those terms in the Terms and Conditions applicable between you and SHAHEEN EXPRESS.
        </p>
      </>
    }
  />
</motion.div>

<motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-center"
        >
<CollapsibleSection
  title="SUMMARY"
  description={
    <>
      <p className=" mt-2 font-sans font-semibold">
        What Data Do We Process?
      </p>
      <br />
      <p>
        We process the Personal Data necessary to provide Services as a Data Processor. This Personal Data is received from the party collecting the Personal Data ("Client") and provided to us for the purpose of delivering the Services.
      </p>
      <p className=" mt-8 font-sans font-semibold">
        How Do We Use the Data?
      </p>
      <br />
      <p>
        After we receive Personal Data from our Clients, we use the data to manage and organize, communicate with the sender, fulfill orders for goods, and most importantly, provide the Services.
      </p>
      <p className=" mt-8 font-sans font-semibold">
        Who Do We Share the Data With?
      </p>
      <br />
      <p>
        If necessary, we may share the Personal Data we receive from our Clients with third parties who cooperate with us in providing the Services, such as our logistics partners.
      </p>
      <p className=" mt-8 font-sans font-semibold">
        How Long Do We Retain the Data?
      </p>
      <br />
      <p>
        We process Personal Data in accordance with the instructions from our Clients or as required by applicable laws.
      </p>
      <p className=" mt-8 font-sans font-semibold">
        How Can Data Subjects Exercise Their Rights Over Their Personal Data?
      </p>
      <br />
      <p>
        If a data subject wishes to exercise their rights over their Personal Data, we may direct the data subject to contact the relevant Client. We will fulfill the data subject's request based on the instructions we receive from the relevant Client.
      </p>
      <p className=" mt-8 font-sans font-semibold">
        Contact Us
      </p>
      <br />
      <p>
        If you have any questions, concerns, or complaints, you can contact us through the contact details found in the Contact Us section.
      </p>
      <p className=" mt-8 font-sans font-semibold">
        How Will We Notify You About Changes?
      </p>
      <br />
      <p>
        We will periodically update this Privacy Notice and notify you via our website.
      </p>
      <br />
      <p>
        Further explanations about the above can be found in the section below.
      </p>
      {/* Add other terms here as needed */}
    </>
  }
/>
</motion.div>
<motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-center"
        >
<CollapsibleSection
  title="WHAT PERSONAL DATA DO WE PROCESS"
  description={
    <>
      <p className="font-sans mt-2 font-semibold">
        1. Types of Personal Data We Process
      </p>
      <br />
      <p>
        "Personal Data" means information that identifies or can be used to identify, contact, or locate a person or device associated with that information. Personal Data includes, but is not limited to, names, addresses, phone numbers. Additionally, to the extent that other information, including personal profiles and/or unique identifiers, is associated or combined with Personal Data, that data is also considered Personal Data.
      </p>
      <br />
      <p>
        The types of Personal Data we process are based on what we need to provide the Services, as a Data Processor.
      </p>
      <br />
      <p>
        As permitted by applicable laws and in accordance with instructions from our clients, we may process different types of Personal Data, which we categorize as follows:
      </p>
      <br />
      <p>a. Identity Data including the name of the goods orderer, name of the sender, and recipient of goods.</p>
      <p>b. Contact Data including the address of the sender and recipient; phone number and/or mobile number of the sender and recipient.</p>
      <p>c. Location Data including geographic location information of the sender, coordinates, live location, and recipient of goods.</p>
      <br />
      <p className="font-sans mt-2 font-semibold">
        2. If the client provides incomplete Personal Data
      </p>
      <br />
      <p>
        If we need to process Personal Data based on legal requirements or the terms of an agreement we have with a Client, and the Client chooses not to provide such Personal Data or provides incomplete Personal Data, we may not be able to provide services or fulfill the agreement we have or are in the process of agreeing upon with the Client.
      </p>
      <br />
      <p>
        We will process the Personal Data as it is (as is) provided to us. The Client is responsible for verifying and ensuring the accuracy of the Personal Data provided to us.
      </p>

      <p className="font-sans mt-8 font-semibold">
        3. How We Collect Your Personal Data
      </p>
      <br />
      <p>
        The Personal Data we process for the purpose of providing our Services is obtained directly from our Clients. We also collect Personal Data to process inquiries about Service usage or complaints through our website and/or receive it via the customer service email we provide.
      </p>
         
      <p className="font-sans mt-8 font-semibold">
        4. How data subjects exercise their rights regarding their data
      </p>
      <br />
      <p>
        Senders and recipients of goods, as data subjects, may have various rights related to their Personal Data under applicable laws.
      </p>
      <br />
      <p>
        We may direct them to contact the related Client so they can submit their requests for exercising their rights directly to our Client.
      </p>
    </>
  }
/>
</motion.div>
<motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-center"
        >

<CollapsibleSection
  title="HOW WE PROCESS YOUR PERSONAL DATA"
  description={
    <>
      <p className="mt-2 font-semibold">
        5- Use of Personal Data We Receive
      </p>
      <p>
        We may use the Personal Data we receive from clients for the following purposes and for other purposes permitted by applicable laws and client instructions ("Purposes"):
      </p>
      <br />
      <li>to enable service providers to act in accordance with client instructions;</li>
      <br />
      <li>to process and facilitate the shipment of goods as per the instructions and requests we receive from our clients;</li>
      <br />
      <li>to communicate with the sender and recipient of goods;</li>
      <br />
      <li>to notify senders, recipients, and clients about any updates related to the Service;</li>
      <br />
      <li>to process and respond to inquiries and feedback from senders, recipients, and clients;</li>
      <br />
      <li>to process any requests, activities, or inquiries made by the Service users;</li>
      <br />
      <li>to provide features to offer, implement, maintain, and improve the Service;</li>
      <br />
      <li>to communicate with Service users;</li>
      <br />
      <li>to provide customer service related to the Service;</li>
      <br />
      <li>to develop the Service;</li>
      <br />
      <li>to comply with our legal obligations, such as providing Personal Data as required by law;</li>
      <br />
      <li>to enforce our rights in case a user’s actions on the site or app harm us, such as damaging the site, app, or Service, submitting false service requests, defrauding us or Service users, and other criminal activities related to the Service.</li>
      <br />
      <p className="mt-2 font-semibold">
        6- Sharing the Personal Data We Collect
      </p>
      <br />
      <p>
        We may disclose or share Personal Data with affiliates and other parties (including agents, vendors, suppliers of goods/services, partners, and others who provide services to us or you, perform certain functions on our behalf, or have commercial partnerships with us) for the following purposes and for other purposes permitted by applicable laws and in accordance with client instructions:
      </p>
      <br />
      <li>if necessary to provide the Service, including but not limited to communicating with the sender and recipient of goods;</li>
      <br />
      <li>if required or authorized by applicable laws (including but not limited to, responding to regulatory inquiries, investigations or guidelines, or complying with filing or reporting requirements, and legal licensing requirements), for the purposes specified in the applicable laws;</li>
      <br />
      <li>if instructed, requested, required, or permitted by competent government authorities, for purposes stated in relevant government policies, regulations, or applicable laws;</li>
      <br />
      <li>if there is any legal process in any form between, related to, or involving the service, for the purposes of that legal process;</li>
      <br />
      <li>in emergency situations related to your safety, for the purpose of handling such emergencies;</li>
      <br />
      <li>in situations related to health or public interest, we may share your Personal Data with competent government authorities and/or other institutions designated by the government or in cooperation with us, for the purpose of contact tracing, supporting initiatives, policies, or government programs, public health, and other purposes as reasonably required;</li>
      <br />
      <li>in connection with insurance claims, we will share Personal Data for the purpose of processing the insurance claim with the insurance company;</li>
      <br />
      <p className="mt-2 font-semibold">
        7- Storage of Personal Data
      </p>
      <br />
      <p>
        Personal Data will only be retained for as long as necessary to fulfill the purposes of its processing, or as long as retention is required or permitted by applicable laws and regulations. We will stop retaining Personal Data, or remove the link to an individual’s identity, as soon as it is considered that the purpose for collecting the Personal Data is no longer needed, and retention is no longer legally required or has been instructed to be deleted by our Client.
      </p>
      <br />
      <p className="mt-2 font-semibold">
        8- Where We Process Your Personal Data
      </p>
      <br />
      <p>
        a. The Personal Data we process may be stored, transferred, or processed by us, our employees located outside Indonesia, or third-party service providers in Indonesia or outside Indonesia, as permitted by applicable laws and regulations. We will use all reasonable efforts to ensure that all third-party service providers offer a level of protection comparable to our commitments under this Privacy Notice.
      </p>
      <br />
      <p>
        b. We will comply with all applicable regulations and laws and make the best efforts to ensure that affiliates and third-party service providers, whether within or outside the country, provide a level of protection equivalent to our commitments under this Privacy Notice.
      </p>
    </>
  }
/>

</motion.div>



<motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-center"
        >
        
<CollapsibleSection
  title="HOW WE PROTECT YOUR PERSONAL DATA"
  description={
    <>
      <p className="mt-2 font-semibold">
       8. The confidentiality of your Personal Data is of utmost importance to us.
      </p>
      <p>
        We will implement our best efforts to protect and secure your data and Personal Data from unauthorized access, collection, use, or disclosure, as well as from processing that is contrary to the law, accidental loss, destruction, damage, or similar risks. However, the transmission of information over the internet is not completely secure. While we will make every effort to protect Personal Data, you acknowledge that we cannot guarantee the integrity and accuracy of any Personal Data sent over the internet, nor guarantee that such data will not be intercepted, accessed, disclosed, altered, or destroyed by unauthorized third parties, due to factors beyond our control.
      </p>
      <br />
      <p className="mt-2 font-semibold">
       9. Anonymized Data
      </p>
      <p>
        We may create, use, license, or disclose Personal Data, provided that (i) all identifying information has been removed so that the data, either alone or in combination with other available data, cannot be linked to or identified as an individual, and (ii) similar data has been aggregated so that the original data forms part of a larger dataset.
      </p>
    </>
  }
/>
</motion.div>

<motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-center"
        >
<CollapsibleSection
  title="WHAT ARE YOUR RIGHTS"
  description={
    <>
      <p className="mt-2 font-semibold">
        10- Access and Correction of Personal Data
      </p>
      <p>
        Senders and recipients of goods, as data subjects, may have certain rights under applicable laws to request that we access, correct, and/or delete their Personal Data that we are currently processing. To the extent these rights are available under applicable laws, they can exercise these rights by contacting us at the details provided in the section below. We can assist by directing them to the relevant Client so they can contact our Client directly.
      </p>
      <br />
      <p>
        We may refuse requests for access to, correction of, and/or deletion of, some or all Personal Data we process if permitted or required under applicable laws and regulations. This includes cases where the Personal Data may contain references to other individuals, or where the request for access, correction, or deletion is for reasons that we consider irrelevant, trivial, frivolous, or potentially related to breaches of terms of use or illegal activities.
      </p>
    </>
  }
/>
</motion.div>
<motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-center"
        >
<CollapsibleSection
  title="MISCELLANEOUS"
  description={
    <>
      <p className="mt-2 font-semibold">
        11. Changes to this Privacy Notice
      </p>
      <br />
      <p>
        We may review and amend this Privacy Notice at our discretion from time to time, to ensure that this Privacy Notice is aligned with our future developments and/or changes in legal or regulatory requirements. If we decide to make changes to this Privacy Notice, we will notify you of such changes through a general notice published on the website.
      </p>
      <br />
    </>
  }
/>
</motion.div>
<motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-center"
        >
<CollapsibleSection
  title="CONTACT US"
  description={
    <>
      <p className="mt-2 font-semibold">
        12. Contact Us
      </p>
      <br />
      <p>
  If you have any questions regarding this Privacy Notice or if you wish to request access, deletion, correction, and/or other rights related to your Personal Data, please contact 
  <a href="mailto:info@shaheen.express" className="text-dgreen underline cursor-pointer"> info@shaheen.express</a>
</p>


      <br />
    </>
  }
/>
</motion.div>
        
      </div>

      {/* Email Section */}
      <EmailSection />
    </div>
  );
};

export default PrivacyPolicy;
