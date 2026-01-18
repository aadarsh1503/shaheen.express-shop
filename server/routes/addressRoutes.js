import express from 'express';
import { 
  getUserAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} from '../controllers/addressController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all user addresses
router.get('/', getUserAddresses);

// Add new address
router.post('/', addAddress);

// Update address
router.put('/:addressId', updateAddress);

// Delete address
router.delete('/:addressId', deleteAddress);

// Set default address
router.patch('/:addressId/default', setDefaultAddress);

export default router;