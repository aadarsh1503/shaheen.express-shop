import axios from 'axios';

// The base URL for your entire backend API
const API_URL = 'https://shaheenexpresscr.crmgcc.net/api';

// ===================================================================
//  INSTANCE 1: User API Client
//  - Uses the 'token' from localStorage.
//  - For all public data fetching and logged-in user actions.
// ===================================================================
const userApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

userApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===================================================================
//  INSTANCE 2: Admin API Client
//  - Uses the 'adminToken' from localStorage.
//  - For protected admin-only actions like creating, updating, deleting.
// ===================================================================
const adminApiClient = axios.create({
  baseURL: API_URL,
});

adminApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken'); // This will be our backup
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// +++ ADD THIS EXPORT LINE +++
export { adminApiClient }; 

export const adminForgotPassword = (email) => {
  // We can use either client since no token is needed for this request
  return userApiClient.post('/admin/forgot-password', { email });
};

/**
 * Resets the admin's password using a token from the email link.
 * This does not require an auth token.
 */
export const adminResetPassword = (token, password) => {
  // We can use either client since no token is needed for this request
  return userApiClient.post(`/admin/reset-password/${token}`, { password });
};

// ===================================================================
//  AUTHENTICATION & USER PROFILE FUNCTIONS
// ===================================================================
export const loginUser = (email, password) => userApiClient.post('/auth/login', { email, password });
export const getCurrentUser = () => userApiClient.get('/auth/me');
export const updateUserProfile = (profileData) => userApiClient.put('/auth/me', profileData);
export const forgotPassword = (email) => userApiClient.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => userApiClient.put(`/auth/reset-password/${token}`, { password });


// ===================================================================
//  PUBLIC/USER-FACING PRODUCT FUNCTIONS
// ===================================================================
export const getProducts = () => userApiClient.get('/products');
export const getProductById = (id) => userApiClient.get(`/products/${id}`);
export const searchProducts = (query) => userApiClient.get(`/products?q=${query}`);
export const getAllShopCategories = () => userApiClient.get('/shop/categories');
export const getShopProductById = (id) => userApiClient.get(`/shop/products/${id}`);
export const getAllShopProducts = () => userApiClient.get('/shop/products');
export const getProductsByCategoryId = (categoryId) => userApiClient.get(`/shop/categories/${categoryId}/products`);
export const getShopProductsByCategory = (categoryId) => userApiClient.get(`/shop/products/category/${categoryId}`);
export const searchShopProducts = (query) => userApiClient.get(`/shop/products/search?q=${query}`);


// ===================================================================
//  *** NEW: USER CART FUNCTIONS ***
// ===================================================================

/**
 * Fetches the user's current cart from the server.
 */
export const getCart = () => {
  return userApiClient.get('/cart');
};

/**
 * Adds a product to the user's cart.
 * @param {string} productId - The ID of the product to add.
 * @param {number} quantity - The quantity to add.
 */
export const addToCart = (productId, quantity) => {
  return userApiClient.post('/cart', { productId, quantity });
};

/**
 * Removes an item completely from the user's cart.
 * @param {string} productId - The ID of the product to remove.
 */
export const removeFromCart = (productId) => {
  // Uses DELETE method on a specific item's resource URL
  return userApiClient.delete(`/cart/${productId}`);
};

/**
 * Updates the quantity of an existing item in the cart.
 * @param {string} productId - The ID of the product to update.
 * @param {number} quantity - The new quantity.
 */
export const updateCartItemQuantity = (productId, quantity) => {
    return userApiClient.put(`/cart/${productId}`, { quantity });
};


// ===================================================================
//  ADMIN-ONLY PROTECTED FUNCTIONS
// ===================================================================
// --- Original Products ---
export const deleteProduct = (id) => adminApiClient.delete(`/products/${id}`);
export const createProduct = (formData) => adminApiClient.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, formData) => adminApiClient.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
// --- Shop Categories ---
export const createShopCategory = (categoryData) => adminApiClient.post('/shop/categories', categoryData);
export const updateShopCategory = (id, categoryData) => adminApiClient.put(`/shop/categories/${id}`, categoryData);
export const deleteShopCategory = (id) => adminApiClient.delete(`/shop/categories/${id}`);
// --- Shop Products ---
export const deleteShopProduct = (id) => adminApiClient.delete(`/shop/products/${id}`);
export const createShopProduct = (formData) => adminApiClient.post('/shop/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateShopProduct = (id, formData) => adminApiClient.put(`/shop/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });