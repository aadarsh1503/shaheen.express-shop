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

// --- DUMMY DATA --- (remains the same)
const productsData = [
  {
      id: 1,
      name: 'Ilford Delta 400 Professional B&W Negative Film',
      price: 5.500,
      currency: 'BHD',
      inStock: true,
      image1: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIIkUlWr0g09ZgOBzRKqem49vmSatEFlFFwg&s', // Original image from screenshot
      image2: 'https://i0.wp.com/www.zoom.bh/wp-content/uploads/2025/08/ilford-delta-120-film-bw-iso-400-791232_1024x.webp?resize=600%2C600&ssl=1', // A sample alternative image
    },
{
  id: 2,
  name: 'K&F 10in1 Wrench Tool',
  price: 6.500,
  currency: 'BHD',
  inStock: true,
  image1: 'data:image/jpeg;base64,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', 
  image2: 'https://i0.wp.com/www.zoom.bh/wp-content/uploads/2025/06/71BA-VR2xnL._AC_SX569_.jpg?w=569&ssl=1', // Swapped for a better hover image
},
{
  id: 3,
  name: 'K&F Swivel and Tilt Mount',
  price: 5.500,
  currency: 'BHD',
  inStock: true,
  image1: 'https://m.media-amazon.com/images/I/710Yx0SnqkL._UF894,1000_QL80_.jpg', 
  image2: 'https://i0.wp.com/www.zoom.bh/wp-content/uploads/2025/06/KF31.133-2-140x140-1.jpg?w=140&ssl=1',
},
{
  id: 4,
  name: '1/4" D-Ring Screw',
  price: 1.000,
  currency: 'BHD',
  inStock: true,
  image1: 'https://m.media-amazon.com/images/I/51gnI-68aqL._UF1000,1000_QL80_.jpg', 
  image2: 'https://i0.wp.com/www.zoom.bh/wp-content/uploads/2023/10/stainless-steel-d-ring-screw-hinged-holder-camera-fixing-screw-1-original-imaghqhppbzaghnr.webp?w=408&ssl=1',
},
{
  id: 5,
  name: 'Vintage Leather Camera Strap',
  price: 12.000,
  currency: 'BHD',
  inStock: true,
  image1: 'https://i0.wp.com/www.zoom.bh/wp-content/uploads/2023/10/Screen-Shot-2021-01-29-at-8.58.55-PM.png?resize=600%2C600&ssl=1',
  image2: 'https://i0.wp.com/www.zoom.bh/wp-content/uploads/2023/10/Screen-Shot-2021-01-29-at-8.58.55-PM.png?resize=600%2C600&ssl=1',
},
{
  id: 6,
  name: 'Portable Mini Tripod',
  price: 9.750,
  currency: 'BHD',
  inStock: false,
  image1: 'https://i0.wp.com/www.zoom.bh/wp-content/uploads/2023/10/1-4-male-to-3-8-male-screw-adapter_1024x1024.jpg?resize=600%2C600&ssl=1',
  image2: 'https://i0.wp.com/www.zoom.bh/wp-content/uploads/2023/10/1-4-male-to-3-8-male-screw-adapter_1024x1024.jpg?resize=600%2C600&ssl=1',
},
{
  id: 7,
  name: 'Lens Cleaning Kit',
  price: 4.200,
  currency: 'BHD',
  inStock: true,
  image1: 'https://i0.wp.com/www.zoom.bh/wp-content/uploads/2023/10/Tripod-thread-adapter.jpg?w=384&ssl=1',
  image2: 'https://i0.wp.com/www.zoom.bh/wp-content/uploads/2023/10/Tripod-thread-adapter.jpg?w=384&ssl=1',
},
{
  id: 8,
  name: 'Camera Backpack Pro',
  price: 25.500,
  currency: 'BHD',
  inStock: true,
  image1: 'https://i0.wp.com/www.zoom.bh/wp-content/uploads/2023/10/10-LED-RING-LIGHT.jpg?resize=600%2C600&ssl=1',
  image2: 'https://i0.wp.com/www.zoom.bh/wp-content/uploads/2023/10/10-LED-RING-LIGHT.jpg?resize=600%2C600&ssl=1',
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
            {product.price} {product.currency}
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