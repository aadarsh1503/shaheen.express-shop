import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductList = ({ products, onEdit, onDelete, selectedProducts, onProductSelect }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            // **NEW**: Pass selection props down to each card
            isSelected={selectedProducts.includes(product.id)}
            onSelect={onProductSelect}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductList;