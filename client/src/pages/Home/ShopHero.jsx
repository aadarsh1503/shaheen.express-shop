import React from 'react';

// --- CONSOLIDATED DATA ---
const allCategories = [
  { name: 'Boxes' },
  { name: 'Bubble Wrap' },
  { name: 'Tape & Dispensers' },
  { name: 'Labels' },
  { name: 'Scales' },
  { name: 'Stretch Film' },
  { name: 'Cargo Straps' },
  { name: 'Hand Trucks' },
  { name: 'Packaging' },
  { name: 'Logistics' },
  { name: 'Supplies' },
  { name: 'Accessories' },
];


// Reusable component for category links (only text now)
const CategoryLink = ({ name }) => (
  <a 
    href="#" 
    className="flex items-center justify-center text-center w-32 h-16 
               transition-transform duration-200 hover:scale-105"
  >
    <span className="text-white text-sm font-light">{name}</span>
  </a>
);

const ShopHero = () => {
  return (
    // Main section with the specified teal background color
    <section className="bg-[#EC2027] w-full py-20 px-4">
      <div className="container mx-auto flex flex-col items-center text-center">
        
        {/* The main "Shop" title */}
        <h1 className="text-white text-5xl font-thin tracking-wide mb-16">
          Shop
        </h1>

        {/* A single grid container now renders all categories uniformly */}
        <div className="flex flex-wrap items-start justify-center gap-x-6 whitespace-nowrap max-w-7xl">
          {allCategories.map((category) => (
            <CategoryLink key={category.name} name={category.name}/>
          ))}
        </div>
          
      </div>
    </section>
  );
};

export default ShopHero;
