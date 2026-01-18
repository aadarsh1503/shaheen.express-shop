import express from 'express';
import { adminSignup, adminLogin, adminForgotPassword, adminResetPassword } from '../controllers/adminAuthController.js';
import { getAllOrdersAdmin, updateOrderStatus } from '../controllers/paymentController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/admin/signup
// @desc    Register a new admin
router.post('/signup', adminSignup);

// @route   POST /api/admin/login
// @desc    Authenticate admin & get token
router.post('/login', adminLogin);
router.post('/forgot-password', adminForgotPassword);
router.post('/reset-password/:token', adminResetPassword);

// @route   GET /api/admin/orders
// @desc    Get all orders for admin (protected)
router.get('/orders', protectAdmin, getAllOrdersAdmin);

// @route   PUT /api/admin/orders/:orderId/status
// @desc    Update order status (protected)
router.put('/orders/:orderId/status', protectAdmin, updateOrderStatus);

// @route   GET /api/admin/test
// @desc    Test admin endpoint
router.get('/test', protectAdmin, (req, res) => {
  res.json({ success: true, message: 'Admin test endpoint working', adminId: req.adminId });
});

export default router;