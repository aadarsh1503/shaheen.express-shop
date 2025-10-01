const express = require('express');
const router = express.Router();
const { createPaymentSession } = require('../controllers/paymentController');

// Define the route
// POST /api/payment/create-session
router.post('/create-session', createPaymentSession);

module.exports = router;