import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const ProductCard = ({ product, onEdit, onDelete }) => {
  
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      layout
      // We add the 'group' class here. Any 'group-hover:' utility within this
      // div will be triggered when this main container is hovered.
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col group"
    >
      {/* 
        NEW: Product Image Container with Hover Effect.
        - 'relative' allows the images inside to be positioned absolutely within this container.
        - 'bg-gray-50' provides a nice background in case images don't fully cover the area (due to object-contain).
      */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-50">
        {/* Default Image (Visible initially) */}
        <img
          src={product.image1 || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={product.name}
          className="absolute inset-0 w-full h-full p-4 object-contain transition-opacity duration-500 ease-in-out group-hover:opacity-0"
        />
        {/* Hover Image (Hidden initially, visible on hover) */}
        <img
          // Smart fallback: If image2 doesn't exist, use image1 so nothing breaks on hover.
          src={product.image2 || product.image1 || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={`${product.name} hover view`}
          className="absolute inset-0 w-full h-full p-4 object-contain transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
        />
      </div>

      {/* Product Info (No changes here) */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-gray-800 truncate" title={product.name}>
            {product.name}
          </h3>
          {product.inStock ? (
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-auto">
          <p className="text-xl font-semibold text-gray-900">
            {Number(product.price).toFixed(3)} 
            <span className="text-sm font-normal text-gray-500 ml-1">{product.currency}</span>
          </p>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(product)}
              className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors duration-300"
              title="Edit Product"
            >
              <FiEdit size={16} />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition-colors duration-300"
              title="Delete Product"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;