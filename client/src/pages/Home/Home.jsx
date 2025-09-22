// src/ShopPage.js
import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  ChevronDown, 
  LayoutGrid, 
  Rows3, 
  ShoppingCart, 
  Expand 
} from 'lucide-react';
// Assume ShopHero is in the same directory
import ShopHero from './ShopHero'; 

// --- DUMMY DATA --- (No changes here)
const productsData = [
  {
    id: 1,
    name: 'Heavy Duty Shipping Boxes',
    price: 15.000,
    currency: 'BHD',
    inStock: true,
    image1: 'https://www.cactuscontainers.com/wp-content/uploads/heavy-duty-shipping-box-surefire_a.jpg',
    image2: 'https://avatars.mds.yandex.net/i?id=3c0175da077558d12b4f1bf81f9ee6aab3aafbc9-6962233-images-thumbs&n=13',
  },
  {
    id: 2,
    name: 'Premium Bubble Wrap Roll (50 meters)',
    price: 8.500,
    currency: 'BHD',
    inStock: true,
    image1: 'https://m.media-amazon.com/images/S/aplus-seller-content-images-us-east-1/A1F83G8C2ARO7P/ACORJUCNHRDHF/316cf6f6-c647-4613-9e5e-ad4988838c73._CR0,0,970,600_PT0_SX970__.jpg',
    image2: 'https://avatars.mds.yandex.net/i?id=5336c186e74be9478c4f17ac942b5ed9caa381e3-7952541-images-thumbs&n=13',
  },
  {
    id: 3,
    name: 'Industrial Strength Packing Tape Gun',
    price: 6.750,
    currency: 'BHD',
    inStock: true,
    image1: 'https://avatars.mds.yandex.net/i?id=056271d3674b5c18e0bff295dd99f30db26d84b4-5234369-images-thumbs&n=13',
    image2: 'https://avatars.mds.yandex.net/i?id=5d49df6eab4561f3f8869e5c1e6c5b98_l-5179939-images-thumbs&ref=rim&n=13&w=800&h=800',
  },
  {
    id: 4,
    name: 'Self-Adhesive Shipping Labels (500 Sheets)',
    price: 12.200,
    currency: 'BHD',
    inStock: true,
    image1: 'https://m.media-amazon.com/images/I/71C3fiEVhUL.jpg',
    image2: 'https://i.ebayimg.com/images/g/9xsAAOxyGwNTBPp4/s-l400.jpg',
  },
  {
    id: 5,
    name: 'Digital Shipping Scale (Up to 50kg)',
    price: 22.000,
    currency: 'BHD',
    inStock: true,
    image1: 'https://avatars.mds.yandex.net/i?id=cd619a8e75f9a97d7fae296888baf989b9fc08ac-4980892-images-thumbs&n=13',
    image2: 'https://avatars.mds.yandex.net/i?id=a09eacab41ccacb26fc80a1928508536a8be5ca0-12752501-images-thumbs&n=13',
  },
  {
    id: 6,
    name: 'Pallet Stretch Wrap Film Roll',
    price: 9.500,
    currency: 'BHD',
    inStock: false,
    image1: 'https://s.alicdn.com/@sc04/kf/Ad9c7aea7ace24ea9a07b1dae309c9210P.png',
    image2: 'https://s.alicdn.com/@sc04/kf/Ad9c7aea7ace24ea9a07b1dae309c9210P.png',
  },
  {
    id: 7,
    name: 'Ratchet Tie-Down Cargo Straps (4-Pack)',
    price: 18.000,
    currency: 'BHD',
    inStock: true,
    image1: 'https://avatars.mds.yandex.net/i?id=d4beb5a86f8ccd6fe1d91943b0dc2ab557d3e3ddbb177c7c-12432361-images-thumbs&n=13',
    image2: 'https://avatars.mds.yandex.net/i?id=a76411832822690c57cd6087fcdcda10e910f8f2-4078287-images-thumbs&n=13',
  },
  {
    id: 8,
    name: 'Heavy-Duty Folding Hand Truck Dolly',
    price: 35.500,
    currency: 'BHD',
    inStock: true,
    image1: 'https://m.media-amazon.com/images/I/41VXniUCO7L._AC_SL1000_.jpg',
    image2: 'https://avatars.mds.yandex.net/i?id=c60cde1bd51565d7093c4b2701143c1f0789c320-12385820-images-thumbs&n=13',
  },
  {
    id: 9,
    name: 'Corrugated Cardboard Boxes (20-Pack)',
    price: 14.000,
    currency: 'BHD',
    inStock: true,
    image1: 'https://avatars.mds.yandex.net/i?id=bf89bb09a439833d5a7d289d5278b050f3e389b1-16457393-images-thumbs&n=13',
    image2: 'https://avatars.mds.yandex.net/i?id=bf89bb09a439833d5a7d289d5278b050f3e389b1-16457393-images-thumbs&n=13',
  },
  {
    id: 10,
    name: 'Double Wall Large Moving Boxes (10-Pack)',
    price: 20.500,
    currency: 'BHD',
    inStock: true,
    image1: 'https://images-na.ssl-images-amazon.com/images/I/41HgnjewhZL.jpg',
    image2: 'https://images-na.ssl-images-amazon.com/images/I/41HgnjewhZL.jpg',
  },
  {
    id: 11,
    name: 'Wooden Euro Pallet (Standard 1200x800mm)',
    price: 28.000,
    currency: 'BHD',
    inStock: true,
    image1: 'https://image.made-in-china.com/2f0j00cABlWayMfbup/Fumigation-Epal-1-Euro-Standard-1200X1000X144mm-Pine-Wood-Pallet-Four-Way-Pallet-1200X800mm.webp',
    image2: 'https://image.made-in-china.com/2f0j00cABlWayMfbup/Fumigation-Epal-1-Euro-Standard-1200X1000X144mm-Pine-Wood-Pallet-Four-Way-Pallet-1200X800mm.webp',
  },
  {
    id: 12,
    name: 'Plastic Shipping Pallet (Heavy Duty)',
    price: 32.750,
    currency: 'BHD',
    inStock: false,
    image1: 'https://i.pinimg.com/originals/ad/b0/03/adb003a6bedbab3867d84dd1040c6fd6.jpg',
    image2: 'https://i.pinimg.com/originals/ad/b0/03/adb003a6bedbab3867d84dd1040c6fd6.jpg',
  },
  {
    id: 13,
    name: 'Foam Cushioning Sheets (100 Pack)',
    price: 7.800,
    currency: 'BHD',
    inStock: true,
    image1: 'https://m.media-amazon.com/images/I/71PYHr3VPkL._AC_UL960_QL65_.jpg',
    image2: 'https://m.media-amazon.com/images/I/71PYHr3VPkL._AC_UL960_QL65_.jpg',
  },
  {
    id: 14,
    name: 'Cargo Net for Pallet Securing',
    price: 19.000,
    currency: 'BHD',
    inStock: true,
    image1: 'https://avatars.mds.yandex.net/i?id=2ff16a8de9285526ef3c93340cdd50306ae0950a-10642623-images-thumbs&n=13',
    image2: 'https://avatars.mds.yandex.net/i?id=2ff16a8de9285526ef3c93340cdd50306ae0950a-10642623-images-thumbs&n=13',
  },
  {
    id: 15,
    name: 'Reusable Plastic Crates (Set of 5)',
    price: 24.500,
    currency: 'BHD',
    inStock: true,
    image1: 'https://avatars.mds.yandex.net/i?id=8e41072a5dc7a3244a52f197cc0096bc39e71180-12472308-images-thumbs&n=13',
    image2: 'https://avatars.mds.yandex.net/i?id=8e41072a5dc7a3244a52f197cc0096bc39e71180-12472308-images-thumbs&n=13',
  },
  {
    id: 16,
    name: 'Edge Protectors for Pallets (50 Pack)',
    price: 11.300,
    currency: 'BHD',
    inStock: true,
    image1: 'https://m.media-amazon.com/images/I/71HJLlKCVgL.jpg',
    image2: 'https://m.media-amazon.com/images/I/71HJLlKCVgL.jpg',
  },
];


// --- NEW DYNAMIC PRODUCT CARD COMPONENT ---
// This component now accepts a `layout` prop ('grid' or 'list')
// and renders a different style for each.
const ProductCard = ({ product, onAddToCart, layout }) => {
  // --- LIST VIEW RENDER ---
  if (layout === 'list') {
    return (
      <div className="flex flex-col sm:flex-row gap-6 border p-4 rounded-lg bg-white shadow-sm w-full transition-shadow hover:shadow-lg">
        {/* Image container */}
        <div className="relative w-full sm:w-48 h-48 flex-shrink-0 bg-white rounded-md overflow-hidden self-center">
          <img
            src={product.image1}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        {/* Details container */}
        <div className="flex flex-col flex-grow text-left">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
          <div className="flex items-center space-x-3 mb-4">
            <p className="text-[#EC2027] font-bold text-lg">
              {product.price.toFixed(3)} {product.currency}
            </p>
            {product.inStock ? (
              <span className="text-green-700 bg-green-100 text-sm font-medium rounded-full px-3 py-1">
                In stock
              </span>
            ) : (
              <span className="text-red-700 bg-red-100 text-sm font-medium rounded-full px-3 py-1">
                Out of stock
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-auto pb-4">
            Essential for logistics and shipping. This high-quality product ensures your items are packed securely and handled efficiently.
          </p>
          <div className="mt-auto">
            <button
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[#EC2027] text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- GRID VIEW RENDER (Default) ---
  return (
    <div className="text-center group">
      <div className="relative overflow-hidden border-b-2 border-[#EC2027] group-hover:border-[#EC2027] transition-colors duration-300 pb-2">
        <div className="relative w-full aspect-square bg-white flex items-center justify-center">
          <img
            src={product.image1}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out group-hover:opacity-0"
          />
          <img
            src={product.image2}
            alt={`${product.name} hover view`}
            className="absolute inset-0 w-full h-full object-contain border border-none transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center
                          opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0
                          transition-all duration-300 ease-in-out">
            <div className="flex bg-white rounded-md shadow-lg overflow-hidden">
                <button 
                  onClick={() => onAddToCart(product)}
                  disabled={!product.inStock}
                  className="p-3 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors disabled:text-gray-300 disabled:hover:bg-white disabled:cursor-not-allowed" 
                  title="Add to Cart"
                >
                    <ShoppingCart size={20} />
                </button>
                <div className="border-l border-gray-200"></div> {/* Separator */}
                <button className="p-3 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors" title="Quick View">
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
            {product.price.toFixed(3)} {product.currency}
          </p>
          {product.inStock ? (
            <span className="text-[#EC2027] text-sm border border-[#EC2027] rounded-full px-3 py-0.5">
              In stock
            </span>
          ) : (
            <span className="text-red-600 text-sm border border-red-300 rounded-full px-3 py-0.5">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};


// --- MAIN SHOP PAGE COMPONENT ---
const ShopPage = ({ onAddToCart }) => {
  // --- STATE MANAGEMENT ---
  // State for the product list that will be displayed
  const [displayedProducts, setDisplayedProducts] = useState(productsData);
  // State for the current layout view ('grid' or 'list')
  const [layout, setLayout] = useState('grid');
  // State for the sorting option
  const [sortBy, setSortBy] = useState('default');
  // State for the 'in stock only' filter
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // --- EFFECT FOR FILTERING AND SORTING ---
  // This effect runs whenever the sorting or stock filter changes
  useEffect(() => {
    let tempProducts = [...productsData];

    // 1. Apply 'In Stock' filter
    if (showInStockOnly) {
      tempProducts = tempProducts.filter(p => p.inStock);
    }

    // 2. Apply sorting
    switch (sortBy) {
      case 'price-asc':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        tempProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sort by ID to maintain original order
        tempProducts.sort((a, b) => a.id - b.id);
        break;
    }

    setDisplayedProducts(tempProducts);
  }, [sortBy, showInStockOnly]);


  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <ShopHero />
      <div className="container mx-auto px-4 py-8">
        {/* --- BREADCRUMBS AND FILTER BAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-gray-600 border-b pb-4">
          <div className="text-sm mb-4 md:mb-0">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-800">Shop</span>
          </div>
          {/* --- INTERACTIVE CONTROLS --- */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
             <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="in-stock"
                checked={showInStockOnly}
                onChange={() => setShowInStockOnly(!showInStockOnly)}
                className="h-4 w-4 rounded border-gray-300 text-[#EC2027] focus:ring-[#EC2027]"
              />
              <label htmlFor="in-stock" className="text-sm select-none">In Stock Only</label>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-gray-300 rounded-md focus:ring-[#EC2027] focus:border-[#EC2027] p-2 text-gray-600 text-sm"
              >
                <option value="default">Default sorting</option>
                <option value="price-asc">Sort by price: low to high</option>
                <option value="price-desc">Sort by price: high to low</option>
                <option value="name-asc">Sort by name: A-Z</option>
                <option value="name-desc">Sort by name: Z-A</option>
              </select>
            </div>
            <div className="hidden md:flex items-center space-x-3 text-gray-400">
                <LayoutGrid 
                  onClick={() => setLayout('grid')}
                  className={`cursor-pointer transition-colors ${layout === 'grid' ? 'text-gray-800' : 'hover:text-gray-800'}`} 
                />
                <Rows3 
                  onClick={() => setLayout('list')}
                  className={`cursor-pointer transition-colors ${layout === 'list' ? 'text-gray-800' : 'hover:text-gray-800'}`} 
                />
            </div>
          </div>
        </div>
        
        {/* --- DYNAMIC PRODUCT DISPLAY --- */}
        {/* The className is now dynamic based on the 'layout' state */}
        <div className={
          layout === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
            : "flex flex-col gap-6"
        }>
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                layout={layout} // Pass layout prop to the card
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <h3 className="text-xl text-gray-700">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;