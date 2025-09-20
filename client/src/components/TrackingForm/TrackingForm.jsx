import React from 'react';
import EmailSection from '../Hero/EmailSection';
import { useEffect } from 'react';


const TrackingForm = () => {
  useEffect(() => {
    // Scroll to the top of the page on mount
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
                 <div className="bg-dgreen font-sans text-white py-10 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h1 className="lg:text-7xl text-2xl mt-20 lg:mt-20 font-poppins font-bold mb-2">Tracking</h1>
        <p className="text-base font-sans mb-12">Track Your Package</p>
        </div>
        </div>
    <div className="flex justify-center items-center lg:mb-32 lg:mt-10 ">

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Input Your Tracking Number</h2>
        <form className="space-y-4">
          {/* Input Field */}
          <input
            type="text"
            placeholder="Enter your tracking number"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold rounded-md px-4 py-2 hover:bg-green-700 transition"
          >
            Track Now
          </button>
        </form>
      </div>
    </div>
    <EmailSection />
    </div>
  );
};

export default TrackingForm;
