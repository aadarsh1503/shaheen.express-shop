import React, { useState, useEffect, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import * as api from '../services/api'; 
import ProductList from '../Products/ProductList';
import ProductForm from '../Products/ProductForm';
import { Plus, Store, LogOut, AlertTriangle } from 'lucide-react'; // Added AlertTriangle for the modal
import { useAuth } from '../../Context/AuthContext';


// --- NEW: A sexy, reusable confirmation modal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;

    return (
        // Backdrop
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={onClose} // Close modal on backdrop click
        >
            {/* Modal Content */}
            <div 
                className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 transform transition-all animate-fade-in-up"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">{children}</p>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="w-full inline-flex justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2.5 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};


const SimpleLoadingSpinner = () => (
    <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
);


function AdminPage() {
  // Original state
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtering and sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); 
  const [sortOrder, setSortOrder] = useState('newest'); 
  
  // --- NEW: State for our logout confirmation modal ---
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { logoutAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProducts();
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        throw new Error("Invalid data format from API");
      }
    } catch (err) {
      setError("Failed to fetch products. Please ensure the backend server is running and you are logged in.");
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter by search term
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filter by stock status
    if (stockFilter === 'inStock') {
      result = result.filter(product => product.inStock);
    } else if (stockFilter === 'outOfStock') {
      result = result.filter(product => !product.inStock);
    }

    // 3. Sort the results
    // IMPORTANT: This assumes your products have an `id` that increments over time for 'newest'/'oldest'.
    // If you have a `createdAt` timestamp, it's better to use that.
    switch (sortOrder) {
      case 'newest':
        result.sort((a, b) => b.id - a.id); // Or: new Date(b.createdAt) - new Date(a.createdAt)
        break;
      case 'oldest':
        result.sort((a, b) => a.id - b.id); // Or: new Date(a.createdAt) - new Date(b.createdAt)
        break;
      case 'a-z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'z-a':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchTerm, stockFilter, sortOrder]);

  const handleOpenModal = (product = null) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setProductToEdit(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
      if (productToEdit) {
        await api.updateProduct(productToEdit.id, formData);
      } else {
        await api.createProduct(formData);
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save product:", error); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  // --- UPDATED: This function now just opens the confirmation modal ---
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  // --- NEW: This function contains the actual logout logic ---
  const handleConfirmLogout = () => {
    logoutAdmin(); // Clears token
    setIsLogoutModalOpen(false); // Close the modal
    navigate('/admin/login'); // Redirect
  };


  return (
    <div className="bg-gray-50 min-h-screen pt-10">
      <main className="container mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Dashboard
          </h1>

          <div className="flex items-center gap-x-4">
            <a href='/admin/Product-shop'>
              <button className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-all transform hover:scale-105">
                <Store className="mr-2 h-5 w-5" />
                Shop Products
              </button>
            </a>
            
            <button onClick={() => handleOpenModal()} className="flex items-center bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-all transform hover:scale-105">
              <Plus className="mr-2 h-5 w-5" />
              Add New Product
            </button>
            
            {/* UPDATED: onClick now triggers our confirmation modal */}
            <button
              onClick={handleLogoutClick}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-all transform hover:scale-105"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
        
        {/* ... Control Panel for Search, Filter, Sort remains the same ... */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search Bar */}
                <div className="md:col-span-1">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-600 mb-1">Search by Name</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FiSearch className="text-gray-400" />
                        </span>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="e.g., Futuristic Gadget"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        />
                    </div>
                </div>

                {/* Stock Filter */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Stock Status</label>
                    <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                        {['all', 'inStock', 'outOfStock'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStockFilter(status)}
                                className={`w-full py-1.5 text-sm font-semibold rounded-md transition-colors ${
                                    stockFilter === status 
                                    ? 'bg-white text-gray-800 shadow-sm' 
                                    : 'text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                {status === 'inStock' ? 'In Stock' : status === 'outOfStock' ? 'Out of Stock' : 'All'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className="md:col-span-1">
                    <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-600 mb-1">Sort By</label>
                    <select
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full py-2 px-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="a-z">Name (A - Z)</option>
                        <option value="z-a">Name (Z - A)</option>
                    </select>
                </div>
            </div>
        </div>
        
        {/* ... Content Display remains the same ... */}
        {/* -- Content Display -- */}
        {loading && <SimpleLoadingSpinner />}
        {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}
        
        {!loading && !error && (
            filteredAndSortedProducts.length > 0 ? (
                <ProductList 
                    products={filteredAndSortedProducts} 
                    onEdit={handleOpenModal} 
                    onDelete={handleDelete} 
                />
            ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700">No Products Found</h3>
                    <p className="text-gray-500 mt-2">
                        No products match your current filters. Try adjusting your search or filter criteria.
                    </p>
                </div>
            )
        )}
      </main>

      <ProductForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        productToEdit={productToEdit}
      />

      {/* --- NEW: Render the sexy logout confirmation modal --- */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
      >
        Are you sure you want to sign out? Your session will be terminated.
      </ConfirmationModal>
    </div>
  );
}

export default AdminPage;