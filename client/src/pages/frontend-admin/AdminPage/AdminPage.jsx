import React, { useState, useEffect, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import * as api from "../services/api";
import ProductList from "../Products/ProductList";
import ProductForm from "../Products/ProductForm";
import { Plus, Store, LogOut, AlertTriangle, Trash2 } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import AdminNavigation from "../components/AdminNavigation";

// --- A reusable confirmation modal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{children}</p>
          </div>
        </div>
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
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { logout: logoutAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProducts();
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        "Failed to fetch products. Please ensure the backend server is running and you are logged in."
      );
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (stockFilter === "inStock") {
      result = result.filter((product) => product.inStock);
    } else if (stockFilter === "outOfStock") {
      result = result.filter((product) => !product.inStock);
    }
    switch (sortOrder) {
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      case "oldest":
        result.sort((a, b) => a.id - b.id);
        break;
      case "a-z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-a":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return result;
  }, [products, searchTerm, stockFilter, sortOrder]);

  useEffect(() => {
    setSelectedProducts([]);
  }, [searchTerm, stockFilter, sortOrder]);

  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // --- NEW: Handler for the "Select All" button ---
  const handleSelectAll = () => {
    const allVisibleProductIds = filteredAndSortedProducts.map((p) => p.id);
    // If all visible products are already selected, deselect all. Otherwise, select all.
    if (selectedProducts.length === allVisibleProductIds.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(allVisibleProductIds);
    }
  };

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
      console.log('🟢 handleSubmit triggered with data:', formData);
  
      if (productToEdit) {
        console.log('✏️ Editing existing product with ID:', productToEdit.id);
        await api.updateProduct(productToEdit.id, formData);
        console.log('✅ Product updated successfully');
      } else {
        console.log('➕ Creating a new product...');
        await api.createProduct(formData);
        console.log('✅ New product created successfully');
      }
  
      console.log('🔄 Refreshing product list...');
      fetchProducts();
  
      console.log('❎ Closing modal...');
      handleCloseModal();
  
    } catch (error) {
      console.error('❌ Failed to save product:', error);
      console.log('⚠️ Error details:', error.response?.data || error.message);
    }
  };
  

  const handleDelete = (product) => {
    setItemToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    setItemToDelete(selectedProducts);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const isBulk = Array.isArray(itemToDelete);
    try {
      if (isBulk) {
        await Promise.all(itemToDelete.map((id) => api.deleteProduct(id)));
      } else {
        await api.deleteProduct(itemToDelete.id);
      }
      fetchProducts();
      setSelectedProducts([]);
    } catch (error) {
      console.error("Failed to delete product(s):", error);
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    logoutAdmin();
    setIsLogoutModalOpen(false);
    navigate("/admin/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-10">
      <main className="container mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Dashboard
          </h1>
          <div className="flex items-center gap-x-4">
            {selectedProducts.length > 0 ? (
              <button
                onClick={handleBulkDelete}
                className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-all transform hover:scale-105"
              >
                <Trash2 className="mr-2 h-5 w-5" /> Delete (
                {selectedProducts.length}) Selected
              </button>
            ) : (
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-all transform hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" /> Add New Product
              </button>
            )}
            <AdminNavigation onLogout={handleLogoutClick} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Search by Name
              </label>
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
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Stock Status
              </label>
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                {["all", "inStock", "outOfStock"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStockFilter(status)}
                    className={`w-full py-1.5 text-sm font-semibold rounded-md transition-colors ${
                      stockFilter === status
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {" "}
                    {status === "inStock"
                      ? "In Stock"
                      : status === "outOfStock"
                      ? "Out of Stock"
                      : "All"}{" "}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-1">
              <label
                htmlFor="sortOrder"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Sort By
              </label>
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

        {loading && <SimpleLoadingSpinner />}
        {error && (
          <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            {/* --- NEW: Selection Info and Select All Button --- */}
            {filteredAndSortedProducts.length > 0 && (
              <div className="flex justify-between items-center mb-4 px-1">
                <p className="text-sm text-gray-600 font-medium">
                  {selectedProducts.length > 0
                    ? `${selectedProducts.length} of ${filteredAndSortedProducts.length} selected`
                    : `${filteredAndSortedProducts.length} products found`}
                </p>
                <button
                  onClick={handleSelectAll}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none"
                >
                  {selectedProducts.length === filteredAndSortedProducts.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
            )}

            {filteredAndSortedProducts.length > 0 ? (
              <ProductList
                products={filteredAndSortedProducts}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                selectedProducts={selectedProducts}
                onProductSelect={handleProductSelection}
              />
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">
                  No Products Found
                </h3>
                <p className="text-gray-500 mt-2">
                  No products match your current filters. Try adjusting your
                  search or filter criteria.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <ProductForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        productToEdit={productToEdit}
      />
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
      >
        Are you sure you want to sign out? Your session will be terminated.
      </ConfirmationModal>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
      >
        {Array.isArray(itemToDelete)
          ? `Are you sure you want to permanently delete these ${itemToDelete.length} products?`
          : `Are you sure you want to permanently delete the product "${itemToDelete?.name}"?`}{" "}
        This action cannot be undone.
      </ConfirmationModal>
    </div>
  );
}

export default AdminPage;
