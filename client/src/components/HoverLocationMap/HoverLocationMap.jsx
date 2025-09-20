import React, { useState, useEffect ,useRef  } from 'react';
import { GoogleMap, useLoadScript, Marker,Polyline , DirectionsService,DirectionsRenderer } from '@react-google-maps/api';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
const GeocodeMap = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 26.1800, lng: 50.5577 }); // Bahrain's coordinates// To control visibility of the info window
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [popupPosition, setPopupPosition] = useState({ lat: 0, lng: 0 }); 
  const [locationName, setLocationName] = useState(''); // To store the name of the location
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupMarker, setPickupMarker] = useState(null);
  const [dropoffMarker, setDropoffMarker] = useState(null);
  const [distance, setDistance] = useState(null);
  const [directions, setDirections] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isPickupSuggestionsVisible, setIsPickupSuggestionsVisible] = useState(false);
const [isDropoffSuggestionsVisible, setIsDropoffSuggestionsVisible] = useState(false);
const [isTypingPickup, setIsTypingPickup] = useState(false); // Track if the user is typing for pickup
const [isTypingDropoff, setIsTypingDropoff] = useState(false);
const [pickupCoordinates, setPickupCoordinates] = useState(null);
const [dropoffCoordinates, setDropoffCoordinates] = useState(null);
const [isSettingPickup, setIsSettingPickup] = useState(true); // Default to setting pickup location

const [directionsResponse, setDirectionsResponse] = useState(null);
const mapRef = useRef(null);



  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCcD5ViBCOqfSKm8qn1sxTFmU6PXz9AbBQ",
    libraries: ["geometry", "drawing","places"]
  });
  const boundsRef = useRef(null); // To store the map bounds


  const [clickedAddress, setClickedAddress] = useState("");
  const vehicles = [
    { id: 1, label: "Walker", icon: "🚶", charge: "Kwd 30" },
    { id: 2, label: "Rider", icon: "🏍️", charge: "Kwd 50" },
    { id: 3, label: "Private Car/Van Driver", icon: "🚘", charge: "Kwd 110" },
  ];

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const clickedCoords = { lat, lng };
  
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: clickedCoords }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
        // Filter out results that include Plus Codes or invalid addresses
        const properAddress = results.find((result) => {
          return (
            result.formatted_address && // Ensure the address is properly formatted
            !result.formatted_address.includes("+") && // Exclude results with Plus Codes
            !result.plus_code // Ensure there is no plus_code field in the result
          );
        });
  
        // If a proper address is found, use it; otherwise, use a fallback
        const address = properAddress?.formatted_address || "Address not found";
  
        // Update either pickup or dropoff location with the filtered address
        if (isSettingPickup) {
          setPickupLocation(address);
          setPickupCoordinates(clickedCoords);
        } else {
          setDropoffLocation(address);
          setDropoffCoordinates(clickedCoords);
        }
  
        // Set the zoom level and pan to the clicked coordinates
        if (mapRef.current) {
          mapRef.current.setZoom(12); // Adjust zoom level as needed
          mapRef.current.panTo(clickedCoords); // Center the map to the new location
        }
  
        console.log("Fetched address:", address); // Log the fetched address
      } else {
        console.error("Geocoding API error:", status);
      }
    });
  };
  
  // Function to calculate and update the distance
  const calculateAndUpdateDistance = (pickupCoords, dropoffCoords) => {
    const pickupLatLng = new google.maps.LatLng(pickupCoords.lat, pickupCoords.lng);
    const dropoffLatLng = new google.maps.LatLng(dropoffCoords.lat, dropoffCoords.lng);
  
    // Calculate the distance in meters
    const distance = google.maps.geometry.spherical.computeDistanceBetween(pickupLatLng, dropoffLatLng);
  
    // Convert the distance to kilometers
    const distanceInKm = distance / 1000;
  
    // Log the distance in the console
    console.log(`Distance between pickup and dropoff: ${distanceInKm.toFixed(2)} km`);
  
    // Optionally, display the distance on the map or in a div
    setDistance(distanceInKm); // Store the distance in state to display
  };
  
  // useEffect to trigger distance calculation when both coordinates are available
  useEffect(() => {
    if (pickupCoordinates && dropoffCoordinates) {
      calculateAndUpdateDistance(pickupCoordinates, dropoffCoordinates); // Call the distance calculation
    }
  }, [pickupCoordinates, dropoffCoordinates]); // Watch for changes in pickupCoordinates and dropoffCoordinates
  
  
  
  // Toggle between setting pickup or drop-off location
  const toggleLocationSetting = () => {
    setIsSettingPickup(!isSettingPickup);
  };
  

const handleCancelPopup = () => {
  setShowPopup(false);
  setPopupPosition({ lat: 0, lng: 0 });
};

const handlePickupChange = (value) => {
  setPickupLocation(value);
  setIsTypingPickup(true);

  // Call Places API for suggestions
  const service = new google.maps.places.AutocompleteService();
  service.getPlacePredictions(
    { input: value, componentRestrictions: { country: 'BH' } },
    (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setPickupSuggestions(predictions);
      }
    }
  );

  // Show the suggestion dropdown when the user is typing
  setIsPickupSuggestionsVisible(true);
};

const handlePickupSuggestionSelect = (suggestion) => {
  setPickupLocation(suggestion.description); // Set the selected location in the input field
  setIsPickupSuggestionsVisible(false); // Hide suggestions after selection
  setIsTypingPickup(false); // Mark as not typing after selection

  // Fetch place details for coordinates
  const service = new google.maps.places.PlacesService(document.createElement('div'));
  service.getDetails({ placeId: suggestion.place_id }, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const location = place.geometry.location;
      setPickupCoordinates({ lat: location.lat(), lng: location.lng() }); // Set pickup coordinates
      if (dropoffCoordinates) {
        updateRoute(pickupCoords, dropoffCoordinates);
        // Calculate the distance between pickup and dropoff
        const distance = calculateDistance(pickupCoords, dropoffCoordinates);
        console.log('Distance between pickup and dropoff:', distance, 'meters');
        setDistance(distance); // Update the state with the distance
      
      }
    }
  });
}
// UseEffect to close the suggestions when a location is selected
useEffect(() => {
  if (!isTypingPickup) {
    // If user has finished typing, hide the suggestions dropdown
    setIsPickupSuggestionsVisible(false);
  }
}, [isTypingPickup]);

const calculateDistance = (pickupCoords, dropoffCoords) => {
  const pickupLatLng = new google.maps.LatLng(pickupCoords.lat, pickupCoords.lng);
  const dropoffLatLng = new google.maps.LatLng(dropoffCoords.lat, dropoffCoords.lng);

  // Use Google Maps API to compute the distance
  const distance = google.maps.geometry.spherical.computeDistanceBetween(pickupLatLng, dropoffLatLng);
  return distance; // Returns distance in meters
};
const updateMapBounds = (pickupCoords, dropoffCoords) => {
  const bounds = new window.google.maps.LatLngBounds();

  if (pickupCoords) {
    bounds.extend(pickupCoords); // Include pickup coordinates
  }
  if (dropoffCoords) {
    bounds.extend(dropoffCoords); // Include drop-off coordinates
  }

  if (mapRef.current) {
    mapRef.current.fitBounds(bounds); // Adjust the map to fit bounds
  }
};
const handleDropoffChange = (value) => {
  setDropoffLocation(value);
  setIsTypingDropoff(true); // Set typing flag to true when user types

  // Call Places API for suggestions
  const service = new google.maps.places.AutocompleteService();
  service.getPlacePredictions({ input: value, componentRestrictions: { country: 'BH' } }, (predictions, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      setDropoffSuggestions(predictions);
    }
  });

  // Show the suggestion dropdown when the user is typing
  setIsDropoffSuggestionsVisible(true);
};

const handleSuggestionSelect = (suggestion) => {
  setDropoffLocation(suggestion.description); // Set the selected location in the input field
  setIsDropoffSuggestionsVisible(false); // Hide suggestions after selection
  setIsTypingDropoff(false); // Mark as not typing after selection

  // Fetch place details for coordinates
  const service = new google.maps.places.PlacesService(document.createElement('div'));
  service.getDetails({ placeId: suggestion.place_id }, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const location = place.geometry.location;
      const dropoffCoords = { lat: location.lat(), lng: location.lng() };
      setDropoffCoordinates(dropoffCoords); // Set dropoff coordinates

      // Adjust map bounds to include pickup and drop-off locations
      updateMapBounds(pickupCoordinates, dropoffCoords); // Pass updated dropoffCoords here
      const distance = calculateDistance(pickupCoordinates, dropoffCoords);
      console.log('Distance between pickup and dropoff:', distance, 'meters');
      setDistance(distance / 1000); // Convert to kilometers and update the state
    
    
    }
  });

};


// UseEffect to close the suggestions when a location is selected
useEffect(() => {
  if (!isTypingDropoff) {
    // If user has finished typing, hide the suggestions dropdown
    setIsDropoffSuggestionsVisible(false);
  }
}, [isTypingDropoff]);

  
  
const navigate = useNavigate();

  const handleSubmit = () => {
    if (pickupLocation === dropoffLocation) {
      alert("Pickup and drop-off locations cannot be the same.");
      return;
    }

    if (pickupMarker && dropoffMarker) {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [pickupMarker],
          destinations: [dropoffMarker],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            const distance = parseFloat(response.rows[0].elements[0].distance.text.replace(" km", ""));
            const submittedData = {
              selectedDate,
              selectedTime,
              phoneNumber,
              name,
              pickupLocation,
              dropoffLocation,
              vehicle: selectedVehicle,
              distance,
            };

            // Navigate to SummaryComponent with data
            navigate("/summaryComponent", { state: { submittedData } });
          } else {
            console.error("Distance Matrix API error:", status);
          }
        }
      );
    }
  };

  const handleAddToPickup = () => {
    if (pickupLocation !== dropoffLocation) {
      setPickupLocation(locationName);
    } else {
      alert("Pickup and dropoff locations cannot be the same.");
    }
    setShowPopup(false); // Hide the popup after selection
  };
  
  const handleAddToDropoff = () => {
    if (pickupLocation !== dropoffLocation) {
      setDropoffLocation(locationName);
    } else {
      alert("Pickup and dropoff locations cannot be the same.");
    }
    setShowPopup(false); // Hide the popup after selection
  };
  

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 p-6 bg-gray-100">
      <ToastContainer />
      <div className="w-full lg:w-1/2 space-y-4">
        <h2 className="text-2xl font-semibold">Where should we pick up and drop off your items?</h2>

        {/* Date and Time Inputs */}
        <div className="flex gap-4">
          <div className="relative w-1/2">
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="relative w-1/2">
            <input
              type="time"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
        </div>

        <PhoneInput
          country={"bh"}
          value={phoneNumber}
          onChange={(phone) => setPhoneNumber(phone)}
          inputClass="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
          placeholder="Enter your phone number"
        />

        <input
          type="text"
          placeholder="Enter Your Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

<div className="relative">
  <input
    type="text"
    value={pickupLocation}
    onChange={(e) => handlePickupChange(e.target.value)}
    onFocus={() => setIsPickupSuggestionsVisible(true)} // Show suggestions on focus
    placeholder="Enter Pickup Location"
    className="w-full p-2 border border-gray-300 rounded"
  />

  {pickupSuggestions.length > 0 && isPickupSuggestionsVisible && (
    <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
      {pickupSuggestions.map((suggestion) => (
        <div
        key={suggestion.place_id}
        onClick={() => handlePickupSuggestionSelect(suggestion)} // Call handleSuggestionSelect on click
        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
      >
        {suggestion.description}
      </div>
      ))}
    </div>
  )}
</div>


<div className="relative">
      <input
        type="text"
        value={dropoffLocation}
        onChange={(e) => handleDropoffChange(e.target.value)}
        onFocus={() => setIsDropoffSuggestionsVisible(true)} // Show suggestions on focus
        placeholder="Enter Dropoff Location"
        className="w-full p-2 border border-gray-300 rounded"
      />

      {dropoffSuggestions.length > 0 && isDropoffSuggestionsVisible && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
          {dropoffSuggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionSelect(suggestion)} // Call handleSuggestionSelect on click
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              {suggestion.description}
            </div>
          ))}
        </div>
      )}
    </div>
  
        <div className="grid-cols-3 grid">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`cursor-pointer p-4 hover:text-white border rounded-lg hover:bg-dgreen ${
                selectedVehicle === vehicle.id ? "bg-red-100" : ""
              }`}
              onClick={() => setSelectedVehicle(vehicle.id)}
            >
              <div className="flex items-center justify-center text-xl">
                {vehicle.icon}
              </div>
              <p className="text-center ">{vehicle.label}</p>
              <p className="text-center ">{vehicle.charge}</p>
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Submit Booking
        </button>


        {submittedData && (
          <div className="w-full mt-8 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
            <h3 className="font-semibold text-xl">Booking Summary</h3>
            <p><strong>Date:</strong> {submittedData.selectedDate}</p>
            <p><strong>Time:</strong> {submittedData.selectedTime}</p>
            <p><strong>Phone:</strong> {submittedData.phoneNumber}</p>
            <p><strong>Name:</strong> {submittedData.name}</p>
            <p><strong>Pickup Location:</strong> {submittedData.pickupLocation}</p>
            <p><strong>Dropoff Location:</strong> {submittedData.dropoffLocation}</p>
            <p><strong>Distance:</strong> {submittedData.distance}</p>
          </div>
        )}
      </div>

      {/* Google Map */}
      <div className="w-full lg:w-1/2 h-96">
      

      {/* Google Map */}
      <div className="w-full  h-96 relative">
      <GoogleMap
  mapContainerStyle={{ width: '100%', height: '100%' }}
  center={pickupCoordinates || dropoffCoordinates || mapCenter} // Fallback center
  zoom={12}
  options={{
    minZoom: 10, // Set a minimum zoom level
    maxZoom: 12, // Optional: Limit the maximum zoom level
    padding: { top: 10, left: 0, bottom: 0, right: 0 },
  }}
  onLoad={(map) => {
    mapRef.current = map; // Store map instance
  }}
  onClick={handleMapClick} // Capture click events on the map
>
  {/* Pickup Marker */}
  {pickupCoordinates && (
    <Marker
      position={pickupCoordinates}
      icon={{
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Blue marker
        scaledSize: new window.google.maps.Size(40, 40), // Resize marker if needed
      }}
    />
  )}

  {/* Drop-off Marker */}
  {dropoffCoordinates && (
    <Marker
      position={dropoffCoordinates}
      icon={{
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // Green marker
        scaledSize: new window.google.maps.Size(40, 40), // Resize marker if needed
      }}
    />
  )}
</GoogleMap>

   
{/* Toggle Button */}
<button
  className={`z-50 py-2 px-4 mt-2 rounded-full text-white font-semibold transition-all duration-300 transform ${
    isSettingPickup
      ? "bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300" // For Pickup
      : "bg-green-500 hover:bg-green-700 focus:ring-2 focus:ring-green-300" // For Dropoff
  } flex items-center justify-center space-x-2`}
  onClick={toggleLocationSetting}
>
  <span className="text-lg">
    {isSettingPickup ? (
      <i className="fa fa-arrow-down"></i> // Pickup icon
    ) : (
      <i className="fa fa-arrow-up"></i> // Dropoff icon
    )}
  </span>
  <span>
    {isSettingPickup ? "Set Drop-off" : "Set Pickup"}
  </span>
</button>
{distance !== null && (
  <div>
    <h3>Distance: {distance.toFixed(2)} km</h3>
  </div>
)}

      </div>
      </div>
    </div>
  );
};

export default GeocodeMap;
