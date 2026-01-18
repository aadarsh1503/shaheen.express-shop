import React, { useState, useEffect } from 'react';
import { getAllShopCategories, createShopCategory, updateShopCategory, deleteShopCategory } from '../services/api';
import AdminNavigation from '../components/AdminNavigation';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [currentName, setCurrentName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // To track which category is being edited
  const [loading, setLoading] = useState(false);
  const { logout: logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getAllShopCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      alert("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        await updateShopCategory(editingCategory.id, { name: currentName });
        alert(`Category "${editingCategory.name}" updated to "${currentName}"`);
      } else {
        // Create new category
        await createShopCategory({ name: currentName });
        alert(`Category "${currentName}" created successfully.`);
      }
      setCurrentName('');
      setEditingCategory(null);
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Error: " + (error.response?.data?.message || "Could not save category."));
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setCurrentName(category.name);
  };
  
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setCurrentName('');
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? This will not delete its products but will un-categorize them.`)) {
      try {
        await deleteShopCategory(categoryId);
        alert(`Category "${categoryName}" deleted.`);
        fetchCategories(); // Refresh list
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Failed to delete category.");
      }
    }
  };

  return (
    <div className="p-6 mt-32 bg-gray-100 rounded-lg shadow-md">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
        <AdminNavigation onLogout={handleLogoutClick} />
      </div>
      
      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-white">
        <label className="block text-gray-700 mb-2">{editingCategory ? 'Edit Category Name' : 'New Category Name'}</label>
        <div className="flex items-center gap-4">
          <input 
            type="text"
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            placeholder="e.g., Boxes"
            className="flex-grow p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {editingCategory ? 'Update' : 'Add'}
          </button>
          {editingCategory && (
            <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancel
            </button>
          )}
        </div>
      </form>
      
      {/* Category List */}
      <h3 className="text-xl font-semibold mb-2">Existing Categories</h3>
      {loading ? <p>Loading...</p> : (
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat.id} className="flex justify-between items-center p-3 bg-white rounded shadow-sm">
              <span className="text-gray-800">{cat.name}</span>
              <div className="space-x-2">
                <button onClick={() => handleEdit(cat)} className="text-sm text-blue-500 hover:underline">Edit</button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="text-sm text-red-500 hover:underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryAdmin;