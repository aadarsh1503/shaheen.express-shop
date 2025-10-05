import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, ShoppingCart, Minus, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 

import { 
  getProductById, 
  getShopProductById, 
  getProducts, 
  getAllShopProducts 
} from '../frontend-admin/services/api';

// --- SEXY, ADVANCED ZOOM PRODUCT CARD (ADAPTED FOR LIST VIEW) ---
const RelatedProductCard = ({ product }) => {
  const imageSrc = product.image || product.image1 || 'https://via.placeholder.com/400';
  const linkTo = `/shop/product/${product.id}`;
  
  const [zoomStyle, setZoomStyle] = useState({});

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  return (
    <Link to={linkTo} className="group flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-300">
      <div 
        className="w-20 h-20 flex-shrink-0 bg-white border border-gray-200 rounded-md overflow-hidden relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img 
          src={imageSrc} 
          alt={product.name} 
          className="w-full h-full object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-125"
          style={zoomStyle}
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-gray-800 leading-tight group-hover:text-[#EC2027] transition-colors">{product.name}</h3>
        <p className="mt-1 text-lg font-extrabold text-gray-900">{parseFloat(product.price).toFixed(3)} BHD</p>
      </div>
    </Link>
  );
};


const ProductDetail = ({ onAddToCart, cartItems }) => { 
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [limitMessage, setLimitMessage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    const fetchAllData = async () => {
      // THIS IS THE FIX: THE GUARD CLAUSE
      // Agar 'id' nahi hai, toh kuch mat karo
      if (!id) {
        setLoading(false);
        setError("Product ID is missing.");
        return; 
      }

      setLoading(true);
      setError(null);
      setRelatedProducts([]);

      try {
        let response = null;
        let productSourceTable = '';
        try {
          response = await getShopProductById(id);
          productSourceTable = 'shop_products';
        } catch (shopError) {
          // Only try the fallback if the first error was a 404, otherwise it might be a server issue
          if (shopError.response && shopError.response.status === 404) {
            response = await getProductById(id);
            productSourceTable = 'products';
          } else {
            // If it's a different error (like 500), throw it to be caught below
            throw shopError;
          }
        }
        const fetchedProduct = response.data;
        const normalizedProduct = {
          ...fetchedProduct,
          productTable: productSourceTable,
          image: fetchedProduct.image || fetchedProduct.image1,
          galleryImages: [fetchedProduct.image, fetchedProduct.image1, fetchedProduct.image2].filter(Boolean)
        };
        setProduct(normalizedProduct);
        if (normalizedProduct.galleryImages.length > 0) {
          setMainImage(normalizedProduct.galleryImages[0]);
        }
        
        const [shopProductsRes, generalProductsRes] = await Promise.all([
          getAllShopProducts(),
          getProducts()
        ]);

        const allProducts = [...shopProductsRes.data, ...generalProductsRes.data];
        const inStockProducts = allProducts.filter(p => p.inStock && p.stockQuantity > 0);
        const shuffled = inStockProducts
          .filter(p => p.id !== fetchedProduct.id)
          .sort(() => 0.5 - Math.random());
          
        setRelatedProducts(shuffled.slice(0, 3));

      } catch (err) {
        console.error("Failed to fetch product or related data:", err);
        setError("Product not found. It may have been removed.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id]); // The dependency on 'id' is correct

  // ... (All logic functions like availableStock, handleQuantityChange, etc., are unchanged)
  const availableStock = useMemo(() => { if (!product) return 0; const itemInCart = cartItems.find(item => item.id === product.id); if (itemInCart) return product.stockQuantity - itemInCart.quantity; return product.stockQuantity; }, [product, cartItems]);
  const handleQuantityChange = (amount) => { if (limitMessage) setLimitMessage(''); setQuantity((prev) => { const newQuantity = prev + amount; if (amount > 0 && newQuantity > availableStock) { setLimitMessage(`That's all we have!`); setTimeout(() => setLimitMessage(''), 3500); return availableStock; } return Math.max(1, newQuantity); }); };
  const handleAddToCartClick = () => { if (!product.inStock || product.stockQuantity <= 0) return; onAddToCart(product, quantity, product.productTable); setQuantity(1); };
  const getStockInfo = () => { if (!product.inStock || product.stockQuantity <= 0) return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Out of Stock</span>; if (product.stockQuantity <= 10) return <div className="flex items-center gap-x-3"><span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">In Stock</span><span className="text-sm font-medium text-red-600 animate-pulse">Hurry, only {product.stockQuantity} total left!</span></div>; return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">In Stock</span>; };


  // --- Render Logic ---
  if (loading) { /* ... loading component ... */ }
  if (error) { /* ... error component ... */ }
  if (!product) return null;

  const isOutOfStock = !product.inStock || product.stockQuantity <= 0;
  const canAddMore = availableStock > 0;

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
        
        {/* --- COLUMN 1: IMAGE GALLERY --- */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square w-full border rounded-lg flex items-center justify-center overflow-hidden">
            <img src={mainImage} alt={product.name} className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"/>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.galleryImages.map((imgUrl, index) => (
              <button key={index} onClick={() => setMainImage(imgUrl)} className={`aspect-square border rounded-md overflow-hidden transition-all duration-200 ${mainImage === imgUrl ? 'ring-2 ring-offset-2 ring-gray-900' : 'hover:opacity-80'}`}>
                <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* --- COLUMN 2: PRODUCT DETAILS --- */}
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-3xl text-gray-700">{parseFloat(product.price).toFixed(3)} BHD</p>
          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <p className="text-base text-gray-600 space-y-4 break-words">{product.description || "No description available."}</p>
          </div>
          <div className="mt-8">{getStockInfo()}</div>
          
          {/* Action Section */}
          <div className="mt-8 flex flex-col">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1 || isOutOfStock} className="p-3 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><Minus size={16} /></button>
                <span className="px-4 text-lg font-medium w-12 text-center">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} disabled={isOutOfStock || quantity >= availableStock} className="p-3 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><Plus size={16} /></button>
              </div>
              <button 
                onClick={handleAddToCartClick} 
                disabled={isOutOfStock || !canAddMore} 
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3 px-6 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                title={isOutOfStock ? "Out of stock" : !canAddMore ? "All available stock is in your cart" : "Add to Cart"}
              >
                <ShoppingCart size={20} />
                <span>Add {quantity} to Cart</span>
              </button>
            </div>
            <AnimatePresence>
              {limitMessage && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ ease: "easeOut", duration: 0.3 }} className="mt-4 text-center text-sm font-semibold text-pink-600">{limitMessage}</motion.p>}
            </AnimatePresence>
          </div>

          {/* **MODIFIED**: Related Products Section is now placed here */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-x-2">
                <Sparkles className="text-[#EC2027]" />
                <span>Complete The Vibe</span>
              </h2>
              <div className="space-y-4">
                {relatedProducts.map(p => (
                  <RelatedProductCard key={`${p.id}-${p.name}`} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;