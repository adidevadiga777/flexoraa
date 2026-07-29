const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/auth.middleware');

// Create Razorpay payment order (requires authentication)
router.post('/create-order', authMiddleware.authUser, paymentController.createOrder);

// Verify Razorpay payment and publish portfolio (requires authentication)
router.post('/verify', authMiddleware.authUser, paymentController.verifyPayment);

module.exports = router;
