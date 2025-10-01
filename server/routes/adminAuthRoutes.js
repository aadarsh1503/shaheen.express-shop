import express from 'express';
import { adminSignup, adminLogin } from '../controllers/adminAuthController.js';

const router = express.Router();

// @route   POST /api/admin/signup
// @desc    Register a new admin
router.post('/signup', adminSignup);

// @route   POST /api/admin/login
// @desc    Authenticate admin & get token
router.post('/login', adminLogin);

export default router;