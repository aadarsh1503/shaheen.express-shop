// components/ShopHero.js (Updated to use custom CSS)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// --- 1. Import your new CSS file ---
import './ShopHero.css';

const CategoryLink = ({ id, name }) => (
  <Link 
    to={`/shop/category/${id}`} 
    className="flex items-center justify-center text-center w-32 h-16 
               transition-transform duration-200 hover:scale-105"
  >
     <div className="group inline-block py-2 transition-transform duration-300 hover:scale-105">
      <span className="text-white text-lg font-semibold tracking-wider">{name}</span>
      <div 
        className="mt-1 h-[2px] w-0 bg-white 
                   transition-all duration-400 ease-in-out 
                   group-hover:w-full"
      />
    </div>
  </Link>
);

const ShopHero = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://shaheen-express-shop.onrender.com/api/shop/categories');
        setCategories(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load categories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    // --- 2. CHANGES ARE HERE ---
    //    - Removed the Tailwind `bg-[#EC2027]` class.
    //    - Added our custom `animated-gradient-bg` class.
    <section className="animated-gradient-bg w-full py-20 px-4">
      <div className="container mx-auto flex flex-col items-center text-center">
        <h1 className="text-white text-5xl font-thin tracking-wide mb-16">Shop</h1>
        <div className="flex flex-wrap items-start justify-center gap-x-6 whitespace-nowrap max-w-7xl">
          {loading && <p className="text-white">Loading categories...</p>}
          {error && <p className="text-white">{error}</p>}
          {!loading && !error && categories.map((category) => (
            <CategoryLink key={category.id} id={category.id} name={category.name} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopHero;