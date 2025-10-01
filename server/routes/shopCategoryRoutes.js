import express from 'express';
import {
  getAllShopCategories,
  createShopCategory,
  updateShopCategory,
  deleteShopCategory
} from '../controllers/shopCategoryController.js';
import { getProductsByCategory } from '../controllers/shopProductController.js';
import { protectAdmin } from '../middleware/authMiddleware.js'; // <-- 1. IMPORT

const router = express.Router();

router.route('/')
  .get(getAllShopCategories)
  .post(protectAdmin, createShopCategory); // <-- Use protectAdmin

router.route('/:id')
  .put(protectAdmin, updateShopCategory) // <-- Use protectAdmin
  .delete(protectAdmin, deleteShopCategory); // <-- Use protectAdmin
  
router.get('/:categoryId/products', getProductsByCategory); // Public

export default router;