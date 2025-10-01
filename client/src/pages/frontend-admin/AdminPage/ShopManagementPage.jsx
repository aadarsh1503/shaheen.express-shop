import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiBox, FiTag, FiDollarSign, FiFileText, FiUploadCloud, FiX, FiSearch } from 'react-icons/fi';
import * as api from '../services/api'; // Your API service
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; 
import { FaMoneyBillWave } from 'react-icons/fa';
// --- Main Shop Management Page Component ---
const ShopManagementPage = () => {
    // Original State
    const [products, setProducts] = useState([]);
    const [isProductsLoading, setIsProductsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const navigate = useNavigate();
    // State for Filtering and Sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');

    const fetchData = useCallback(async () => {
        setIsProductsLoading(true);
        setIsCategoriesLoading(true);
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                api.getAllShopProducts(),
                api.getAllShopCategories()
            ]);
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error("Failed to fetch shop data:", error);
        } finally {
            setIsProductsLoading(false);
            setIsCategoriesLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];
        if (searchTerm) {
            result = result.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (stockFilter === 'inStock') {
            result = result.filter(product => product.inStock);
        } else if (stockFilter === 'outOfStock') {
            result = result.filter(product => !product.inStock);
        }
        if (categoryFilter !== 'all') {
            result = result.filter(product => product.categoryId === parseInt(categoryFilter));
        }
        switch (sortOrder) {
            case 'newest': result.sort((a, b) => b.id - a.id); break;
            case 'oldest': result.sort((a, b) => a.id - b.id); break;
            case 'a-z': result.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'z-a': result.sort((a, b) => b.name.localeCompare(a.name)); break;
            default: break;
        }
        return result;
    }, [products, searchTerm, stockFilter, categoryFilter, sortOrder]);

    // --- FIXED HANDLERS ---
    const handleOpenProductModal = (product = null) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    const handleCloseProductModal = () => {
        setEditingProduct(null);
        setIsProductModalOpen(false);
    };

    const handleProductSubmit = async (formData) => {
        try {
            if (editingProduct) {
                await api.updateShopProduct(editingProduct.id, formData);
            } else {
                await api.createShopProduct(formData);
            }
            await fetchData(); // Refresh all data
            handleCloseProductModal();
        } catch (error) {
            console.error("Failed to save product:", error);
            alert("Error: Could not save product.");
        }
    };
    
    const handleProductDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.deleteShopProduct(productId);
                await fetchData(); // Refresh all data
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert("Error: Could not delete product.");
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-10">
            <main className="container mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
    
    {/* Left Side: Grouped Back Button and Title */}
    <div className="flex items-center gap-x-3">
        <button
            onClick={() => navigate(-1)} // This is the magic for going back
            aria-label="Go back"
            className="p-2 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
            Shop Management
        </h1>
    </div>

    {/* Right Side: Action Button */}
    <button 
        onClick={() => handleOpenProductModal()} 
        className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105"
    >
        <FiPlus className="mr-2" size={20} />
        Add New Product
    </button>
</div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Search Bar */}
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-600 mb-1">Search by Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiSearch className="text-gray-400" /></span>
                                <input type="text" id="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="e.g., Luxury Box" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"/>
                            </div>
                        </div>

                        {/* Stock Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Stock Status</label>
                            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                                {['all', 'inStock', 'outOfStock'].map(status => (
                                    <button key={status} onClick={() => setStockFilter(status)} className={`w-full py-1.5 text-sm font-semibold rounded-md transition-colors ${stockFilter === status ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}>
                                        {status === 'inStock' ? 'In Stock' : status === 'outOfStock' ? 'Out of Stock' : 'All'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                            <select id="categoryFilter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full py-2 px-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
                                <option value="all">All Categories</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        
                        {/* Sort Dropdown */}
                        <div>
                            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-600 mb-1">Sort By</label>
                            <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full py-2 px-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="a-z">Name (A - Z)</option>
                                <option value="z-a">Name (Z - A)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Products</h2>
                             {isProductsLoading ? (
                                <p className="text-center text-gray-500 py-8">Loading products...</p>
                             ) : (
                                <ProductList 
                                    products={filteredAndSortedProducts}
                                    onEdit={handleOpenProductModal}
                                    onDelete={handleProductDelete}
                                />
                             )}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>
                             <CategoryManager categories={categories} isLoading={isCategoriesLoading} refreshData={fetchData} />
                        </div>
                    </div>
                </div>
            </main>
            
            <ProductFormModal 
                isOpen={isProductModalOpen}
                onClose={handleCloseProductModal}
                onSubmit={handleProductSubmit}
                productToEdit={editingProduct}
                categories={categories}
            />
        </div>
    );
};

// --- Child components ---
const ProductList = ({ products, onEdit, onDelete }) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-10">
                <h3 className="text-lg font-semibold text-gray-700">No Products Found</h3>
                <p className="text-gray-500 mt-2">
                    No products match your current filters. Try adjusting your search or filter criteria.
                </p>
            </div>
        );
    }
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                     <AnimatePresence>
                    {products.map(product => (
                        <motion.tr key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.name} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{Number(product.price).toFixed(3)} BHD</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {product.inStock ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>
                                ) : (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Out of Stock</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end items-center space-x-2">
                                    <button onClick={() => onEdit(product)} className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full transition-colors"><FiEdit size={16} /></button>
                                    <button onClick={() => onDelete(product.id)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors"><FiTrash2 size={16} /></button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                     </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
};

const CategoryManager = ({ categories, isLoading, refreshData }) => {
    const [name, setName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            if (editingCategory) {
                await api.updateShopCategory(editingCategory.id, { name });
            } else {
                await api.createShopCategory({ name });
            }
            setName('');
            setEditingCategory(null);
            await refreshData();
        } catch (error) {
            console.error("Failed to save category:", error);
            alert("Error: Could not save category.");
        }
    };
    
    const handleDelete = async (categoryId) => {
        if(window.confirm("Are you sure you want to delete this category and ALL its products? This action cannot be undone.")) {
            try {
                await api.deleteShopCategory(categoryId);
                await refreshData();
            } catch (error) {
                console.error("Failed to delete category:", error);
                alert("Error: Could not delete category.");
            }
        }
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setName(category.name);
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setName('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="mb-6 space-y-3">
                <label className="text-sm font-medium text-gray-700">{editingCategory ? 'Edit Category' : 'Add New Category'}</label>
                <div className="flex gap-2">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Boxes" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"/>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold">{editingCategory ? 'Update' : 'Add'}</button>
                </div>
                 {editingCategory && <button type="button" onClick={handleCancelEdit} className="text-sm text-gray-500 hover:underline">Cancel Edit</button>}
            </form>
            {isLoading ? <p>Loading...</p> : (
                <ul className="space-y-2">
                     <AnimatePresence>
                    {categories.map(cat => (
                        <motion.li key={cat.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-800">{cat.name}</span>
                            <div className="flex items-center space-x-1">
                                <button onClick={() => handleEditClick(cat)} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"><FiEdit size={14}/></button>
                                <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"><FiTrash2 size={14}/></button>
                            </div>
                        </motion.li>
                    ))}
                     </AnimatePresence>
                </ul>
            )}
        </div>
    );
};

const ProductFormModal = ({ isOpen, onClose, onSubmit, productToEdit, categories }) => {
    const [formData, setFormData] = useState({ name: '', price: '', inStock: true, categoryId: '', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    useEffect(() => {
        if (isOpen) {
            if (productToEdit) {
                setFormData({
                    name: productToEdit.name || '',
                    price: productToEdit.price || '',
                    inStock: !!productToEdit.inStock,
                    categoryId: productToEdit.categoryId || '',
                    description: productToEdit.description || ''
                });
                setImagePreview(productToEdit.image || '');
            } else {
                 setFormData({ name: '', price: '', inStock: true, categoryId: categories[0]?.id || '', description: '' });
                 setImagePreview('');
            }
            setImageFile(null);
        }
    }, [isOpen, productToEdit, categories]);

    const handleTextChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        if (imageFile) {
            data.append('image', imageFile);
        } else if (productToEdit) {
            data.append('existingImage', productToEdit.image);
        }

        await onSubmit(data);
        setIsSubmitting(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={onClose}>
                    <motion.div initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
                        <AnimatePresence>
                          {isSubmitting && <SubmittingLoader />}
                        </AnimatePresence>
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
                            <ImageUploader name="image" preview={imagePreview} onChange={handleFileChange} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <InputWithIcon Icon={FiTag} type="text" name="name" value={formData.name} onChange={handleTextChange} placeholder="Product Name" required />
                               <InputWithIcon Icon={FaMoneyBillWave} type="number" name="price" value={formData.price} onChange={handleTextChange} placeholder="Price" step="0.001" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select name="categoryId" value={formData.categoryId} onChange={handleTextChange} className="w-full px-3 py-2.5 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                    <option value="">Select a category</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <InputWithIcon Icon={FiFileText} name="description" value={formData.description} as="textarea" onChange={handleTextChange} placeholder="Product details..." rows="3" />
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                <label className="font-semibold text-gray-700">In Stock</label>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleTextChange} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-300 disabled:opacity-50">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                  {isSubmitting ? (productToEdit ? 'Updating...' : 'Adding...') : (productToEdit ? 'Update Product' : 'Add Product')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const SubmittingLoader = () => {
  const loaderVariants = { animation: { transition: { staggerChildren: 0.15 } } };
  const dotVariants = { animation: { y: [0, -12, 0], transition: { duration: 1.2, ease: "easeInOut", repeat: Infinity } } };
  return (
    <motion.div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex justify-center items-center z-10 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="flex space-x-2" variants={loaderVariants} animate="animation">
        <motion.div className="w-3 h-3 bg-blue-500 rounded-full" variants={dotVariants} />
        <motion.div className="w-3 h-3 bg-blue-500 rounded-full" variants={dotVariants} />
        <motion.div className="w-3 h-3 bg-blue-500 rounded-full" variants={dotVariants} />
      </motion.div>
    </motion.div>
  );
};

const ImageUploader = ({ name, preview, onChange }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-2">Product Image</label>
      <label htmlFor={name} className="relative cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-40 flex justify-center items-center hover:border-blue-500 transition-colors">
        {preview ? <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" /> : <div className="text-center text-gray-400"><FiUploadCloud size={32} className="mx-auto" /><p className="mt-2 text-sm">Click to upload</p></div>}
        <input id={name} name={name} type="file" accept="image/*" onChange={onChange} className="sr-only" />
      </label>
    </div>
  );
  
const InputWithIcon = ({ Icon, as = "input", ...props }) => {
    const Component = as;
    return (
        <div className="relative">
            <Icon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <Component {...props} className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white" />
        </div>
    );
};


export default ShopManagementPage;