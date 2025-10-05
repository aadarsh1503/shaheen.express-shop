// src/pages/frontend-admin/AdminPage/CategoryProductsPage.js (COMPLETE AND UPDATED)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShopProductsByCategory } from '../services/api';
import { ShoppingCartIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper Components (No Changes Here) ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="w-16 h-16 border-4 border-t-4 border-t-[#EC2027] border-gray-200 rounded-full animate-spin"></div>
  </div>
);
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };


// --- Product Card (Internal Component) ---
const ProductCard = ({ product, onAddToCart }) => {
  const getStockInfo = () => {
    if (!product.inStock || product.stockQuantity <= 0) {
      return (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          Out of Stock
        </span>
      );
    }
    if (product.stockQuantity <= 5) {
      return (
        <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
          Hurry, only {product.stockQuantity} left!
        </span>
      );
    }
    return (
       <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          In Stock
        </span>
    );
  };

  return (
    <motion.div variants={itemVariants}>
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
          {getStockInfo()}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-lg font-bold text-slate-800 truncate">{product.name}</h2>
          <p className="text-sm text-slate-500 mt-1 flex-grow line-clamp-2">{product.description}</p>
          
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
             <p className="text-xl font-bold text-[#EC2027]">{product.price} BHD</p>
             <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  // Check is not strictly needed because of `disabled`, but it's good practice
                  if (product.inStock) {
                    onAddToCart(product, 1, 'shop_products');
                  }
                }}
                // This 'disabled' prop is the key to solving the problem
                disabled={!product.inStock || product.stockQuantity <= 0}
                className="p-3 bg-slate-100 rounded-full text-slate-600 transition-all duration-300 ease-in-out hover:bg-[#EC2027] hover:text-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC2027] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-slate-200 disabled:hover:text-slate-400"
                aria-label="Add to Cart"
             >
                <ShoppingCartIcon className="h-5 w-5" />
             </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


// --- Main Page Component ---
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
    fetchProducts(); 
  }, [categoryId]);

  if (loading) {
    return <div className="text-center mt-20 h-screen"><LoadingSpinner /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-10">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Category Products
            </h1>
            <div className="mt-3 w-24 h-1.5 bg-[#EC2027] mx-auto rounded-full"></div>
        </div>
        <AnimatePresence>
          {products.length === 0 ? (
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
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {products.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoryProductsPage;