import express from 'express';
import { adminSignup, adminLogin, adminForgotPassword, adminResetPassword } from '../controllers/adminAuthController.js';

const router = express.Router();

// @route   POST /api/admin/signup
// @desc    Register a new admin
router.post('/signup', adminSignup);

// @route   POST /api/admin/login
// @desc    Authenticate admin & get token
router.post('/login', adminLogin);
router.post('/forgot-password', adminForgotPassword);
router.post('/reset-password/:token', adminResetPassword);

export default router;