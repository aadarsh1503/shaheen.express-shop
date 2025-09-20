import React from "react";
import { useLocation } from "react-router-dom";

const SummaryComponent = () => {
  const { state } = useLocation(); // Retrieve data from the state passed via navigation
  const submittedData = state || {}; // Access the entire submitted data
  console.log(submittedData);

  // Return a message if no data is available
  if (!submittedData || Object.keys(submittedData).length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">
          No booking data found. Please go back and submit your booking.
        </p>
      </div>
    );
  }

  const perKmCharge = 10; // Distance charge per kilometer
  const distance = submittedData.distance || 0; // Default to 0 if distance is undefined
  const distanceCharge = distance * perKmCharge;

  // Handle missing or undefined selectedVehicle and its charge

  const totalCharge = submittedData.selectedVehicle.charge + distanceCharge; // Add the charges as numbers

  // Ensure totalCharge is a number
  const formattedTotalCharge = !isNaN(totalCharge) ? totalCharge.toFixed(2) : "0.00"; // Format to 2 decimal places

  return (
    <div className="flex items-center justify-center h-[900px] bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6 border-b pb-4">
          Booking Summary
        </h3>
        <table className="w-full text-left border-collapse border border-gray-300">
          <tbody>
            <tr className="border-b">
              <th className="p-4 text-gray-600 font-medium">Date and Time</th>
              <td className="p-4 text-gray-800">
                {submittedData.selectedDate} - {submittedData.selectedTime}
              </td>
            </tr>
            <tr className="border-b">
              <th className="p-4 text-gray-600 font-medium">Name</th>
              <td className="p-4 text-gray-800">{submittedData.name}</td>
            </tr>
            <tr className="border-b">
              <th className="p-4 text-gray-600 font-medium">Phone Number</th>
              <td className="p-4 text-gray-800">{submittedData.phoneNumber}{submittedData.numericPhone1}</td>
            </tr>
            <tr className="border-b">
              <th className="p-4 text-gray-600 font-medium">Pickup Location</th>
              <td className="p-4 text-gray-800">{submittedData.pickupLocation}</td>
            </tr>
            <tr className="border-b">
              <th className="p-4 text-gray-600 font-medium">Dropoff Location</th>
              <td className="p-4 text-gray-800">{submittedData.dropoffLocation}</td>
            </tr>
            <tr className="border-b">
              <th className="p-4 text-gray-600 font-medium">Dropoff Contact</th>
              <td className="p-4 text-gray-800">{submittedData.phoneNumber1}{submittedData.numericPhone}</td>
            </tr>
            <tr className="border-b">
              <th className="p-4 text-gray-600 font-medium">Vehicle</th>
              <td className="p-4 text-gray-800">
                {submittedData.selectedVehicle ? submittedData.selectedVehicle.label : "N/A"}
              </td>
            </tr>
            <tr className="border-b">
              <th className="p-4 text-gray-600 font-medium">Vehicle Charge</th>
              <td className="p-4 text-gray-800">
                {submittedData.selectedVehicle.charge} BHD
              </td>
            </tr>
            <tr className="border-b">
              <th className="p-4 text-gray-600 font-medium">Distance</th>
              <td className="p-4 text-gray-800">
                {distance.toFixed(2)} km
              </td>
            </tr>
            <tr className="border-b">
              <th className="p-4 text-gray-600 font-medium">Distance Charge</th>
              <td className="p-4 text-gray-800"> {distanceCharge.toFixed(2)} BHD</td>
            </tr>
            <tr>
              <th className="p-4 text-gray-600 font-bold">Total Charge</th>
              <td className="p-4 text-gray-800 font-bold">{formattedTotalCharge} BHD</td>
            </tr>
          </tbody>
        </table>
        <div className="text-center mt-4">
          
        </div>
      </div>
    </div>
  );
};

export default SummaryComponent;
