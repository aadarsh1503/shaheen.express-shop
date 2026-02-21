import express from 'express';
import { createPaymentSession, verifyPayment, getUserOrders, getOrderDetails, handleBenefitPayCallback, handleBenefitPayWebhook } from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { testBenefitPayConnectivity } from '../utils/networkTest.js';

const router = express.Router();

// Create payment session (MPGS or BENEFIT PAY)
router.post('/create-session', createPaymentSession);

// Verify payment after callback
router.post('/verify-payment', verifyPayment);

// BENEFIT PAY callback endpoint (GET request from BENEFIT PAY gateway)
router.get('/benefit-callback', handleBenefitPayCallback);

// BENEFIT PAY webhook endpoint (POST request for notifications)
router.post('/benefit-webhook', handleBenefitPayWebhook);

// BENEFIT PAY network connectivity test (admin only)
router.get('/test-benefit-connectivity', async (req, res) => {
  try {
    const results = await testBenefitPayConnectivity();
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user orders (protected route)
router.get('/orders', authenticateToken, getUserOrders);

// Get single order details for invoice (protected route)
router.get('/order/:orderId', authenticateToken, getOrderDetails);

export default router;