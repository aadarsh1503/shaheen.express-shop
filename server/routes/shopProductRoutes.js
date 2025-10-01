// routes/shopProductRoutes.js
import express from 'express';
import {
  getAllShopProducts, // <-- FIX #3: Import the correct local controller
  getShopProductsByCategory,
  createShopProduct,
  updateShopProduct,
  getShopProductById,  
  deleteShopProduct,
  searchShopProducts
} from '../controllers/shopProductController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();
const handleUpload = upload.fields([{ name: 'image', maxCount: 1 }]); 

// --- PUBLIC GET ROUTES ---

// GET /api/shop/products
router.get('/', getAllShopProducts);

// GET /api/shop/products/search?q=...
// This route is more specific, so it comes before the general /:id route
router.get('/search', searchShopProducts); 

// GET /api/shop/products/category/:categoryId
router.get('/category/:categoryId', getShopProductsByCategory);

// GET /api/shop/products/:id
// FIX #1: The path is now just '/:id', not '/shop/products/:id'
router.get('/:id', getShopProductById);

// --- PROTECTED ADMIN ROUTES ---
// These are more concise and correct
router.post('/', protectAdmin, handleUpload, createShopProduct);
router.put('/:id', protectAdmin, handleUpload, updateShopProduct);
router.delete('/:id', protectAdmin, deleteShopProduct);

export default router;