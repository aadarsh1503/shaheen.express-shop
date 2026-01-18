import express from 'express';
import { createPaymentSession, verifyPayment, getUserOrders, getOrderDetails } from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create MPGS payment session
router.post('/create-session', createPaymentSession);

// Verify payment after callback
router.post('/verify-payment', verifyPayment);

// Get user orders (protected route)
router.get('/orders', authenticateToken, getUserOrders);

// Get single order details for invoice (protected route)
router.get('/order/:orderId', authenticateToken, getOrderDetails);

export default router;