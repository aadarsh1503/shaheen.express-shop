import express from 'express';
// Import the named exports using curly braces
import { signup, login ,getUserInfo, updateUserInfo ,  forgotPassword, resetPassword   } from '../controllers/authController.js'; // Notice the .js extension
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getUserInfo);
router.put('/me', protect, updateUserInfo); 
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router; // Use export default