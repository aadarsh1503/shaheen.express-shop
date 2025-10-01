import express from 'express';
import {
    addItemToCart,
    getCartItems,
    updateCartItemQuantity,
    removeCartItem,
    clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
    .get(getCartItems)
    .post(addItemToCart)
    .delete(clearCart);

router.route('/:cartItemId')
    .put(updateCartItemQuantity) // Renamed for clarity
    .delete(removeCartItem);

export default router;