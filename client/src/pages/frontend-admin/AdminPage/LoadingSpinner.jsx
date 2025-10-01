import React from 'react';

const LoadingSpinner = () => {
  return (
    // This outer div centers the spinner on the page or within its container.
    // The py-20 adds vertical padding so it doesn't sit right at the top.
    <div className="flex justify-center items-center py-20">
      
      {/* This is the actual spinner element */}
      <div 
        className="
          animate-spin 
          rounded-full 
          h-16 
          w-16 
          border-4 
          border-gray-200 
          border-t-blue-500
        "
      >
      </div>

    </div>
  );
};

export default LoadingSpinner;