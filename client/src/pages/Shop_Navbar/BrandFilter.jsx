import React, { useState } from 'react';

const BrandFilter = ({ title, items, initialVisibleCount = 10 }) => {
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (item) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleShowMore = () => {
    setVisibleCount(items.length);
  };

  const remainingCount = items.length - visibleCount;
  const itemsToShow = items.slice(0, visibleCount);

  // --- NEW LOGIC: Split items into 4 columns ---
  const numColumns = 4;
  const itemsPerColumn = Math.ceil(itemsToShow.length / numColumns);
  
  const columns = Array.from({ length: numColumns }, (_, colIndex) => {
    const start = colIndex * itemsPerColumn;
    const end = start + itemsPerColumn;
    return itemsToShow.slice(start, end);
  });

  return (
    // Removed max-w-xs to allow the component to expand
    <div className="w-full"> 
      <h3 className="text-white text-3xl font-thin tracking-wide mb-8">
        {title}
      </h3>

      {/* Grid container for the columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8">
        {columns.map((columnItems, colIndex) => (
          <ul key={colIndex} className="space-y-4">
            {columnItems.map((item) => (
              <li key={item}>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checkedItems[item] || false}
                    onChange={() => handleCheckboxChange(item)}
                    className="form-checkbox h-5 w-5 rounded-sm bg-white border-none text-[#EC2027] focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="ml-4 text-white font-light text-sm tracking-wider group-hover:text-gray-200 whitespace-nowrap">
                    {item}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ))}
      </div>

      {remainingCount > 0 && (
        <button
          onClick={handleShowMore}
          className="text-white text-sm font-light underline mt-8 hover:text-gray-200 transition-colors"
        >
          Show {remainingCount} more
        </button>
      )}
    </div>
  );
};

export default BrandFilter;