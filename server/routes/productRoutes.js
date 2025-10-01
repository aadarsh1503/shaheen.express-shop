import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { searchShopProducts } from '../controllers/shopProductController.js';

const router = express.Router();

const handleUploads = upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
]);

router.route('/')
  .get(getAllProducts)
  .post(protectAdmin, handleUploads, createProduct); // <-- Use protectAdmin
  router.get('/shop/products/search', searchShopProducts); // <-- ADD THIS LINE
router.route('/:id')
  .get(getProductById)
  .put(protectAdmin, handleUploads, updateProduct) // <-- Use protectAdmin
  .delete(protectAdmin, deleteProduct); // <-- Use protectAdmin

export default router;