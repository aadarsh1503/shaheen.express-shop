// src/pages/Shop/ShopPage.js (COMPLETE AND UPDATED)

import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Switch } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Expand 
} from 'lucide-react';
import ShopHero from './ShopHero';

// --- PRODUCT CARD COMPONENT ---
const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (product.inStock && product.stockQuantity > 0) {
      onAddToCart(product, 1, 'products');
    }
  };
  
  const getStockInfo = () => {
    if (!product.inStock || product.stockQuantity <= 0) {
      return (
        <span className="text-red-600 text-sm border border-red-300 rounded-full px-3 py-0.5">
          Out of stock
        </span>
      );
    }
    if (product.stockQuantity <= 5) {
      return (
        <span className="text-yellow-800 text-sm border border-yellow-700 rounded-full px-3 py-0.5 animate-pulse">
          Hurry, only {product.stockQuantity} left!
        </span>
      );
    }
    return (
      <span className="text-green-600 text-sm border border-green-600 rounded-full px-3 py-0.5">
        In stock
      </span>
    );
  };

  return (
    <Link to={`/shop/product/${product.id}`}  className="text-center group block">
      <div dir='ltr' className="relative overflow-hidden border-b-2 border-[#EC2027] group-hover:border-[#EC2027] transition-colors duration-300 pb-2">
        <div className="relative w-full aspect-square bg-white flex items-center justify-center">
          <img
            src={product.image1}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-500 ease-in-out group-hover:opacity-0"
          />
          <img
            src={product.image2 || product.image1}
            alt={`${product.name} hover view`}
            className="absolute inset-0 w-full h-full object-contain p-4 border border-none transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center
                          opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0
                          transition-all duration-300 ease-in-out">
            <div className="flex bg-white rounded-md shadow-lg overflow-hidden">
                <button 
                  onClick={handleAddToCartClick}
                  // This 'disabled' prop is the key to solving the problem
                  disabled={!product.inStock || product.stockQuantity <= 0}
                  className="p-3 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors disabled:text-gray-300 disabled:hover:bg-white disabled:cursor-not-allowed" 
                  title={!product.inStock || product.stockQuantity <= 0 ? "Out of Stock" : "Add to Cart"}
                >
                    <ShoppingCart size={20} />
                </button>
                <div className="border-l border-gray-200"></div>
                <button 
                  className="p-3 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors" 
                  title="View Details"
                >
                  <Expand size={20} />
                </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-gray-700 text-base">{product.name}</h3>
        <div className="mt-2 flex items-center justify-center space-x-2">
          <p className="text-[#EC2027] font-medium">
            {Number(product.price).toFixed(3)} {product.currency}
          </p>
          {getStockInfo()}
        </div>
      </div>
    </Link>
  );
};

// --- MAIN SHOP PAGE COMPONENT ---
const ShopPage = ({ onAddToCart }) => {
  const [allProducts, setAllProducts] = useState([]); 
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://shaheen-express-shop.onrender.com/api/products');
        setAllProducts(response.data);
        setDisplayedProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let tempProducts = [...allProducts];
    if (showInStockOnly) {
      tempProducts = tempProducts.filter(p => p.inStock && p.stockQuantity > 0);
    }
    switch (sortBy) {
      case 'price-asc': tempProducts.sort((a, b) => a.price - b.price); break;
      case 'price-desc': tempProducts.sort((a, b) => b.price - a.price); break;
      case 'name-asc': tempProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': tempProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
    }
    setDisplayedProducts(tempProducts);
  }, [sortBy, showInStockOnly, allProducts]);

  const renderContent = () => {
    if (loading) return <div className="col-span-full text-center py-16 text-lg">Loading products...</div>;
    if (error) return <div className="col-span-full text-center py-16 text-red-600">{error}</div>;
    if (displayedProducts.length === 0) {
      return (
        <div className="col-span-full text-center py-16">
          <h3 className="text-xl text-gray-700">No products found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
        </div>
      );
    }
    return displayedProducts.map((product) => (
      <ProductCard 
        key={product.id} 
        product={product} 
        onAddToCart={onAddToCart} 
      />
    ));
  };

  return (
    <div dir='ltr' className="font-sans bg-gray-50 min-h-screen">
      <ShopHero />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-gray-600 border-b pb-4">
          <div className="text-sm mb-4 md:mb-0">
            <Link to='/'>Home</Link><span className="mx-2">/</span><span className="font-medium text-gray-800">Shop</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Switch.Group as="div" className="flex items-center space-x-3">
              <Switch.Label className="text-sm font-medium text-gray-700 select-none cursor-pointer">In Stock Only</Switch.Label>
              <Switch
                checked={showInStockOnly}
                onChange={setShowInStockOnly}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${showInStockOnly ? 'bg-[#EC2027]' : 'bg-gray-200'}`}
              >
                <span className="sr-only">Toggle in-stock products</span>
                <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${showInStockOnly ? 'translate-x-5' : 'translate-x-0'}`} />
              </Switch>
            </Switch.Group>
            <div className="relative inline-block w-64">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none cursor-pointer rounded-lg border-2 border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 transition hover:border-gray-300 focus:border-[#EC2027] focus:outline-none focus:ring-2 focus:ring-[#EC2027]/50"
              >
                <option value="default">Default sorting</option>
                <option value="price-asc">Sort by price: low to high</option>
                <option value="price-desc">Sort by price: high to low</option>
                <option value="name-asc">Sort by name: A-Z</option>
                <option value="name-desc">Sort by name: Z-A</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75
 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;