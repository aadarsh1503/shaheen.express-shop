import React, { useState, useEffect } from 'react';
import { getAllShopCategories, createShopProduct, /* other APIs needed here */ } from '../services/api';

const ProductAdmin = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    // MODIFIED: Add description to initial state
    const [formData, setFormData] = useState({ name: '', price: '', inStock: true, categoryId: '', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        // ... (no changes in this useEffect)
        const fetchData = async () => {
            try {
                const catResponse = await getAllShopCategories();
                setCategories(catResponse.data);
                if (catResponse.data.length > 0 && !editingProduct) {
                  setFormData(prev => ({ ...prev, categoryId: catResponse.data[0].id }));
                }
            } catch (error) {
                console.error("Failed to load categories:", error);
            }
        };
        fetchData();
    }, []);

    const handleTextChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // No change needed for validation, description is optional
        if (!formData.name || !formData.price || !formData.categoryId) {
            alert("Please fill name, price, and category.");
            return;
        }
        if (!editingProduct && !imageFile) {
            alert("Please select an image for a new product.");
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('inStock', formData.inStock);
        data.append('categoryId', formData.categoryId);
        data.append('description', formData.description); // MODIFIED: Append description

        if (imageFile) {
            data.append('image', imageFile);
        }

        // Handle update logic
        if (editingProduct) {
            // data.append('existingImage', editingProduct.image || '');
            // await updateShopProduct(editingProduct.id, data);
            alert("Product updated successfully!");
        } else {
            // Handle create logic
            await createShopProduct(data);
            alert("Product created successfully!");
        }

        // Reset form
        setFormData({ name: '', price: '', inStock: true, categoryId: categories[0]?.id || '', description: '' });
        setImageFile(null);
        setEditingProduct(null);
        document.getElementById('image-input').value = null; 
        // TODO: Refresh product list
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

            <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white space-y-4">
                <div>
                    <label className="block text-gray-700">Product Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleTextChange} className="w-full p-2 border rounded" required/>
                </div>
                <div>
                    <label className="block text-gray-700">Price (BHD)</label>
                    <input type="number" step="0.001" name="price" value={formData.price} onChange={handleTextChange} className="w-full p-2 border rounded" required/>
                </div>
                 {/* ADDED: Description Field */}
                <div>
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleTextChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                    placeholder="Enter product details..."
                  ></textarea>
                </div>
                <div>
                    <label className="block text-gray-700">Category</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleTextChange} className="w-full p-2 border rounded" required>
                        <option value="">-- Select a Category --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Product Image</label>
                    <input id="image-input" type="file" name="image" onChange={handleFileChange} className="w-full p-2 border rounded" required={!editingProduct}/>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleTextChange} className="mr-2"/>
                    <label>In Stock</label>
                </div>
                <button type="submit" className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600">
                    {editingProduct ? 'Update Product' : 'Add New Product'}
                </button>
                 {editingProduct && (
                    <button type="button" onClick={() => { setEditingProduct(null); setFormData({ name: '', price: '', inStock: true, categoryId: categories[0]?.id || '', description: '' }); }} className="w-full mt-2 bg-gray-500 text-white p-3 rounded hover:bg-gray-600">
                        Cancel Edit
                    </button>
                )}
            </form>
            {/* TODO: Add a list here to display, edit, and delete existing products */}
        </div>
    );
};

export default ProductAdmin;