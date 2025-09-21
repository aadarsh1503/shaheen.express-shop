// src/ShopPage.js
import React from 'react';
import { 
  SlidersHorizontal, 
  ChevronDown, 
  LayoutGrid, 
  Rows3, 
  Menu, 
  ShoppingCart, 
  Expand 
} from 'lucide-react';
// Assume ShopHero is in the same directory
import ShopHero from './ShopHero'; 

// --- DUMMY DATA --- (Updated for Courier, Cargo, Logistics)
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
];


// --- PRODUCT CARD COMPONENT ---
// It now receives an `onAddToCart` prop to call when the button is clicked.
const ProductCard = ({ product, onAddToCart }) => {
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
                {/* MODIFIED: onClick handler added */}
                <button 
                  onClick={() => onAddToCart(product)}
                  className="p-3 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors" 
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
// It receives `onAddToCart` and passes it to the ProductCard.
const ShopPage = ({ onAddToCart }) => {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <ShopHero />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-gray-600">
          <div className="text-sm mb-4 md:mb-0">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-800">Shop</span>
          </div>
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 hover:text-gray-900">
              <SlidersHorizontal size={20} />
              <span>Filters</span>
            </button>
            <div className="flex items-center space-x-2">
              <select className="bg-transparent border-none focus:ring-0 p-0 text-gray-600">
                <option>Default sorting</option>
                <option>Sort by price: low to high</option>
                <option>Sort by price: high to low</option>
                <option>Sort by newness</option>
              </select>
            </div>
            <div className="hidden md:flex items-center space-x-3 text-gray-400">
                <LayoutGrid className="cursor-pointer text-gray-800" />
                <Rows3 className="cursor-pointer hover:text-gray-800" />
                <Menu className="cursor-pointer hover:text-gray-800" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {productsData.map((product) => (
            // Pass the handler down to each card
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;