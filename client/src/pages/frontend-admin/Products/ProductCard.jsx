import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const ProductCard = ({ product, onEdit, onDelete, isSelected, onSelect }) => {
  
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
    exit: { y: -20, opacity: 0 }
  };

  // Helper to prevent card selection when clicking a button
  const stopPropagation = (e, callback) => {
    e.stopPropagation();
    callback();
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      layout
      onClick={() => onSelect(product.id)}
      className={`bg-white rounded-xl overflow-hidden shadow-lg border flex flex-col group cursor-pointer transition-all duration-300 relative ${isSelected ? 'border-blue-500 scale-[1.03] shadow-blue-200/50' : 'border-gray-100'}`}
    >
      <div className="absolute top-4 right-4 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product.id)}
          onClick={(e) => e.stopPropagation()}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>

      <div className="relative h-56 w-full overflow-hidden bg-gray-50">
        <img src={product.image1 || 'https://via.placeholder.com/400x300?text=No+Image'} alt={product.name} className="absolute inset-0 w-full h-full p-4 object-contain transition-opacity duration-500 ease-in-out group-hover:opacity-0"/>
        <img src={product.image2 || product.image1 || 'https://via.placeholder.com/400x300?text=No+Image'} alt={`${product.name} hover`} className="absolute inset-0 w-full h-full p-4 object-contain transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"/>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-gray-800 truncate pr-4" title={product.name}>{product.name}</h3>
          {product.inStock ? <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">In Stock</span> : <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">Out of Stock</span>}
        </div>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <p className="text-xl font-semibold text-gray-900">{Number(product.price).toFixed(3)} <span className="text-sm font-normal text-gray-500 ml-1">{product.currency}</span></p>
          <div className="flex items-center space-x-2">
            <button onClick={(e) => stopPropagation(e, () => onEdit(product))} className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors duration-300" title="Edit"><FiEdit size={16} /></button>
            <button onClick={(e) => stopPropagation(e, () => onDelete(product))} className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition-colors duration-300" title="Delete"><FiTrash2 size={16} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;