import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, ShoppingCart, Minus, Plus } from 'lucide-react';

// Import the new functions we just created
import { getProductById, getShopProductById } from '../frontend-admin/services/api';

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams(); // Get the product ID from the URL

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        let response = null;
        let productSourceTable = ''; // <-- ADD THIS
        try {
          response = await getShopProductById(id);
          productSourceTable = 'shop_products'; // <-- SET IT HERE
        } catch (shopError) {
          console.log(`Product ${id} not found in shop, trying general products...`);
          response = await getProductById(id);
          productSourceTable = 'products'; // <-- OR SET IT HERE
        }

        const fetchedProduct = response.data;
        const normalizedProduct = {
          ...fetchedProduct,
          productTable: productSourceTable, // <-- STORE IT IN STATE
          image: fetchedProduct.image || fetchedProduct.image1,
          galleryImages: [
            fetchedProduct.image, 
            fetchedProduct.image1, 
            fetchedProduct.image2
          ].filter(Boolean) // .filter(Boolean) removes any null/undefined entries
        };
        
        setProduct(normalizedProduct);
        // Set the initial main image for the gallery
        if (normalizedProduct.galleryImages.length > 0) {
          setMainImage(normalizedProduct.galleryImages[0]);
        }
        
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Product not found. It may have been removed.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]); // Re-run this effect if the ID in the URL changes

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCartClick = () => {
    // onAddToCart is a function passed from a parent component (like App.js)
    // It should handle the global cart state.
    onAddToCart(product, quantity, product.productTable);
    console.log(`Added ${quantity} of ${product.name} to cart.`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto text-center py-20 px-4">
        <AlertCircle className="h-16 w-16 mx-auto text-red-500" />
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">An Error Occurred</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <Link to="/shop" className="mt-6 inline-block bg-gray-800 text-white font-bold py-2 px-6 rounded hover:bg-gray-700 transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!product) return null; // Should be covered by error state, but good practice

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square w-full border rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.galleryImages.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setMainImage(imgUrl)}
                className={`aspect-square border rounded-md overflow-hidden transition-all duration-200 ${mainImage === imgUrl ? 'ring-2 ring-offset-2 ring-gray-900' : 'hover:opacity-80'}`}
              >
                <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{product.name}</h1>
          
          <p className="mt-4 text-3xl text-gray-700">
            {parseFloat(product.price).toFixed(2)} BHD
          </p>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <p className="text-base text-gray-600 space-y-4">
              {product.description || "No description available for this product."}
            </p>
          </div>
          
          <div className="mt-8">
             {product.inStock ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Out of Stock
                </span>
              )}
          </div>

          <div className="mt-8 flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <button 
                onClick={() => handleQuantityChange(-1)} 
                disabled={quantity <= 1}
                className="p-3 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 text-lg font-medium w-12 text-center">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)}
                disabled={!product.inStock}
                className="p-3 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCartClick}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3 px-6 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;