import React from 'react'
import { motion } from "framer-motion";
import EmailSection from '../Hero/EmailSection'

const TANDC = () => {
  return (
    <div>
        
          <div className="bg-dgreen font-sans  text-white py-10 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h1 className="lg:text-7xl text-2xl mt-20 lg:mt-20 font-poppins font-bold mb-2">T&C</h1>
        <p className="text-base font-sans mb-12">Terms and Conditions</p>
        </div>
       
        </div>

        <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className=" lg:flex p-4 justify-center items-center"
      >
        <div>
       <div class="max-w-6xl  font-poppins mt-8 leading-relaxed text-gray-700 mb-10 mx-auto">
    <h1 class="text-3xl text-dgreen">A. Definitions</h1>
    <br />
    <p>1- <span class="font-extrabold">User</span> refers to the party utilizing Shaheen Express's delivery services.</p>
    <br />
    <p>2- <span class="font-extrabold">Sender</span> is a registered User who sends Goods to other Users.</p>
    <br />
    <p>3- <span class="font-extrabold">Buyer</span> is a registered User requesting the delivery of Goods.</p>
    <br />
    <p>4- <span class="font-extrabold">Shaheen Express</span> refers to PT Swift Shipment Solutions, the company providing delivery services for Goods.</p>
    <br />
    <p>5- <span class="font-extrabold">Courier</span> is a third-party partner collaborating with Shaheen Express to deliver and pick up Goods for Users.</p>
    <br />
    <p>6- <span class="font-extrabold">Delivery</span> with Shaheen Express refers to the delivery of Goods managed by Shaheen Express, where pick-up and delivery activities are performed by Couriers recommended by Shaheen Express to facilitate the User’s shipping process.</p>
    <br />
    <p>7- <span class="font-extrabold">Goods</span> refers to tangible items that meet the criteria for shipment by delivery service companies.</p>
    <br />
    <p>8- <span class="font-extrabold">Successful Delivery</span> occurs when the Buyer confirms receipt of the Goods or the Courier successfully delivers the Goods to the Buyer's address.</p>
    <br />
    <p>9- <span class="font-extrabold">Terms</span> and Conditions refer to the terms and conditions for Delivery with Shaheen Express.</p>
    <br />

    <h1 class="text-3xl text-dgreen mt-8">B. General</h1>
    <br />
    <p>1- By using Delivery with Shaheen Express, the User understands and agrees to grant Shaheen Express the right and authority to recommend and choose an appropriate Courier for the pick-up and delivery of Goods.</p>
    <br />
    <p>2- Users can track the shipping status of Goods via https://gvs-logistics.vercel.app/tracking-Form</p>
    <br />

    <h1 class="text-3xl text-dgreen">C. Shipping Terms</h1>
    <br />
    <p>1- For every item to be shipped, the Courier is entitled to receive information from the Sender, including the recipient's name, complete delivery address, and a clear description of the Goods.</p>
    <br />
    <p>2- Delivery with Shaheen Express is available in certain regions in Indonesia with a maximum product weight of 50 kg (fifty kilograms). The maximum dimensions for packages are 50 cm x 50 cm x 50 cm.</p>
    <br />
    <p>3- Weight is calculated based on the greater of actual or volumetric weight. The volumetric weight formula is (Length x Width x Height) / 6000. For example, a package measuring 50 cm x 50 cm x 50 cm would have a volumetric weight of 20.83 kg, rounded to 21 kg.</p>
    <br />
    <p>4- The Courier responsible for pick-up may differ from the Courier delivering the Goods.</p>
    <br />
    <p>5- Couriers will only deliver Goods as per applicable terms and conditions and have the right to accept or reject certain items in line with Shaheen Express’s policies and partner Courier conditions. Refer to the Shaheen Express Shipping FAQ for details.</p>
    <br />
    <p>6- Couriers are authorized to handle, store, and transport Goods in accordance with their operational policies.</p>
    <br />
    <p>7- Senders are responsible for adequately packaging Goods. Couriers may refuse to pick up inadequately packaged items.</p>
    <br />
    <p>8- Senders must ensure proper packaging to guarantee safe handling and delivery of the Goods.</p>
    <br />
    <p>9- Special packaging is recommended for fragile or perishable items. Couriers are not liable for damage to such Goods.</p>
    <br />
    <p>10- Items prohibited from shipment include hazardous, explosive, and illegal items, among others. For a complete list, please refer to Shaheen Express’s policy.</p>
    <br />
    <p>11- If prohibited items are shipped without the Courier's knowledge, the Courier is exempt from liability or claims.</p>
    <br />
    <p>12- Couriers reserve the right to inspect shipments for compliance with shipping requirements.</p>
    <br />
    <p>13- Couriers are not responsible for discrepancies between the Sender's description and the actual content of the Goods.</p>
    <br />
    <p>14- Compensation for damage or loss caused by Courier negligence is subject to specific conditions.</p>
    <br />
    <p>15- Uninsured shipments are eligible for compensation up to 10 times the shipping cost or a maximum of IDR 1,000,000, whichever is lower.</p>
    <br />

    <h1 class="text-3xl text-dgreen">D. Data Usage</h1>
    <br />
    <p>1- The security of personal data belonging to Senders and Buyers is crucial. Shaheen Express employs security standards to protect this data and ensures it is used solely for delivery purposes as outlined in Shaheen Express’s Privacy Policy.</p>
    <br />
    <p>2- Users authorize Shaheen Express to store, share, and transmit data related to delivery services to partner Couriers for operational purposes.</p>
    <br />
    <p>Refer to Shaheen Express’s Privacy Policy for details at https://gvs-logistics.vercel.app/privacy-policy.</p>
</div>

<EmailSection />
    </div>
    </motion.div>
    </div>
  )
}

export default TANDC