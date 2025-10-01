import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUploadCloud, FiTag, FiDollarSign, FiFileText } from 'react-icons/fi';
import { FaMoneyBillWave } from 'react-icons/fa';

// --- The Sexy, Futuristic Loader Component ---
const SubmittingLoader = () => {
  const loaderVariants = {
    animation: {
      transition: {
        staggerChildren: 0.15, // Creates a wave effect
      },
    },
  };

  const dotVariants = {
    animation: {
      y: [0, -12, 0], // Bouncing animation
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.div
      className="absolute inset-0 bg-white/80 backdrop-blur-sm flex justify-center items-center z-10 rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex space-x-2"
        variants={loaderVariants}
        animate="animation"
      >
        <motion.div className="w-3 h-3 bg-blue-500 rounded-full" variants={dotVariants} />
        <motion.div className="w-3 h-3 bg-blue-500 rounded-full" variants={dotVariants} />
        <motion.div className="w-3 h-3 bg-blue-500 rounded-full" variants={dotVariants} />
      </motion.div>
    </motion.div>
  );
};


// --- The Main Product Form Component ---
const ProductForm = ({ isOpen, onClose, onSubmit, productToEdit }) => {

  const initialFormState = {
    name: '',
    price: '',
    currency: 'BHD',
    inStock: true,
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [image1File, setImage1File] = useState(null);
  const [image2File, setImage2File] = useState(null);
  const [image1Preview, setImage1Preview] = useState('');
  const [image2Preview, setImage2Preview] = useState('');

  // NEW: State to manage the loading overlay
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setFormData({
          name: productToEdit.name || '',
          price: productToEdit.price || '',
          currency: productToEdit.currency || 'BHD',
          // THE BUG FIX: Explicitly cast `inStock` to a pure boolean
          inStock: !!productToEdit.inStock,
          description: productToEdit.description || '',
        });
        setImage1Preview(productToEdit.image1 || '');
        setImage2Preview(productToEdit.image2 || '');
        setImage1File(null);
        setImage2File(null);
      } else {
        setFormData(initialFormState);
        setImage1File(null);
        setImage2File(null);
        setImage1Preview('');
        setImage2Preview('');
      }
      // Reset submitting state when modal opens
      setIsSubmitting(false);
    }
  }, [productToEdit, isOpen]);

  const handleTextChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      if (name === 'image1') {
        setImage1File(file);
        setImage1Preview(previewUrl);
      } else if (name === 'image2') {
        setImage2File(file);
        setImage2Preview(previewUrl);
      }
    }
  };

  // MODIFIED: `handleSubmit` is now async to manage loading state
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // --- Turn loader ON ---

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image1File) data.append('image1', image1File);
    if (image2File) data.append('image2', image2File);
    if (productToEdit) {
      data.append('existingImage1', productToEdit.image1 || '');
      data.append('existingImage2', productToEdit.image2 || '');
    }
    
    try {
      await onSubmit(data); // This calls the function in AdminPage and waits for it to finish
    } catch (error) {
      console.error("Submission failed in ProductForm:", error);
      // You could show an error toast to the user here
    } finally {
      // This block runs whether the submission succeeded or failed
      setIsSubmitting(false); // --- Turn loader OFF ---
    }
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    hidden: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative" // --- ADD 'relative' for loader positioning
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* --- NEW: Loader Overlay --- */}
            <AnimatePresence>
              {isSubmitting && <SubmittingLoader />}
            </AnimatePresence>
            
            {/* -- Modal Header -- */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FiX size={24} />
              </button>
            </div>

            {/* -- Form -- */}
            <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ImageUploader name="image1" preview={image1Preview} onChange={handleFileChange} />
                <ImageUploader name="image2" preview={image2Preview} onChange={handleFileChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <InputWithIcon Icon={FiTag} type="text" name="name" value={formData.name} onChange={handleTextChange} placeholder="Product Name" required />
                <InputWithIcon Icon={FaMoneyBillWave} type="number" name="price" value={formData.price} onChange={handleTextChange} placeholder="Price" step="0.001" required />
              </div>

              <div className="relative mb-6">
                <FiFileText className="absolute top-3.5 left-4 text-gray-400" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleTextChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-gray-50"
                  rows="4"
                  placeholder="Enter product details..."
                />
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <label htmlFor="inStock" className="text-gray-700 font-semibold">In Stock Status</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="inStock" name="inStock" checked={formData.inStock} onChange={handleTextChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              
              {/* -- Form Actions with disabled state -- */}
              <div className="flex justify-end mt-8">
                <button 
                  type="button" 
                  onClick={onClose} 
                  disabled={isSubmitting} // Disable when submitting
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2.5 px-6 rounded-lg mr-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} // Disable when submitting
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {productToEdit ? 'Updating...' : 'Adding...'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Helper Components for a cleaner Form ---
const ImageUploader = ({ name, preview, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-gray-600 mb-2 capitalize">{name.replace('image', 'Image ')}</label>
    <label htmlFor={name} className="relative cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-40 flex justify-center items-center hover:border-blue-500 transition-colors">
      {preview ? (
        <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
      ) : (
        <div className="text-center text-gray-400">
          <FiUploadCloud size={32} className="mx-auto" />
          <p className="mt-2 text-sm">Click to upload</p>
        </div>
      )}
      <input id={name} name={name} type="file" accept="image/*" onChange={onChange} className="sr-only" />
    </label>
  </div>
);

const InputWithIcon = ({ Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
    <input {...props} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-gray-50" />
  </div>
);

export default ProductForm;