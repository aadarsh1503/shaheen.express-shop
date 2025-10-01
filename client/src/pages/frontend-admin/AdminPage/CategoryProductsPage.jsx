// src/pages/frontend-admin/AdminPage/CategoryProductsPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShopProductsByCategory } from '../services/api';
import { ShoppingCartIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
// <<< CHANGE 1: Import framer-motion for professional animations >>>
import { motion, AnimatePresence } from 'framer-motion';

// A more professional loading spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="w-16 h-16 border-4 border-t-4 border-t-[#EC2027] border-gray-200 rounded-full animate-spin"></div>
  </div>
);

// <<< CHANGE 2: Define animation variants for the grid and cards >>>
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Each card will appear 0.1s after the previous one
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const CategoryProductsPage = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getShopProductsByCategory(categoryId);
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products for this category:", error);
      } finally {
        setLoading(false);
      }
    };

    // Simulate a slightly longer load to showcase the animation
    setTimeout(fetchProducts, 500); 
  }, [categoryId]);

  if (loading) {
    return <div className="text-center mt-20 h-screen"><LoadingSpinner /></div>;
  }

  return (
    // <<< CHANGE 3: A clean, professional background >>>
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-10">
        {/* <<< CHANGE 4: A strong, professional header >>> */}
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Category Products
            </h1>
            <div className="mt-3 w-24 h-1.5 bg-[#EC2027] mx-auto rounded-full"></div>
        </div>

        <AnimatePresence>
          {products.length === 0 ? (
            // <<< CHANGE 5: An improved, professional "empty state" message >>>
            <motion.div
              className="text-center mt-16 p-10 bg-white rounded-xl shadow-sm border border-slate-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-slate-400" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-800">No Products Found</h2>
              <p className="text-slate-500 mt-2">This category is currently empty. Please try another one or check back soon.</p>
            </motion.div>
          ) : (
            // <<< CHANGE 6: Apply the container animation to the grid >>>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {products.map(product => (
                // <<< CHANGE 7: The Professional, Animated Product Card >>>
                // Each card is a motion.div to apply itemVariants
                <motion.div key={product.id} variants={itemVariants}>
                  <Link 
                    to={`/shop/product/${product.id}`}
                    className="group flex flex-col bg-white border border-slate-200/80 rounded-xl shadow-md overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2"
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-56 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                        onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/400' }}
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h2 className="text-lg font-bold text-slate-800 truncate">{product.name}</h2>
                      <p className="text-sm text-slate-500 mt-1 flex-grow line-clamp-2">{product.description}</p>
                      
                      {/* Price and Button are grouped at the bottom */}
                      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                         <p className="text-xl font-bold text-[#EC2027]">{product.price} BHD</p>
                         <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              onAddToCart(product, 1, 'shop_products');
                            }}
                            className="p-3 bg-slate-100 rounded-full text-slate-600 transition-all duration-300 ease-in-out hover:bg-[#EC2027] hover:text-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC2027]"
                            aria-label="Add to Cart"
                         >
                            <ShoppingCartIcon className="h-5 w-5" />
                         </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoryProductsPage;