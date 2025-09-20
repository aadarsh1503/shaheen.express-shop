import React, { useState } from "react";

const VehicleSelection = () => {
  // Sample vehicle data with added charges
  const vehicles = [
    {
      id: 1,
      label: "Car",
      icon: "🚗", // You can use an icon or image here
      charge: "MYR 50", // Charge for this vehicle
    },
    {
      id: 2,
      label: "Truck",
      icon: "🚚",
      charge: "MYR 100",
    },
    {
      id: 3,
      label: "Van",
      icon: "🚐",
      charge: "MYR 75",
    },
  ];

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Select Vehicle</h2>

      {/* Vehicle Selection */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`p-4 border rounded-lg shadow-md cursor-pointer ${
              selectedVehicle === vehicle.id
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setSelectedVehicle(vehicle.id)}
          >
            <div className="text-4xl text-center mb-2">{vehicle.icon}</div>
            <p className="text-center text-sm font-medium">{vehicle.label}</p>
            {selectedVehicle === vehicle.id && (
              <p className="mt-2 text-center text-lg font-semibold">{vehicle.charge}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleSelection;
