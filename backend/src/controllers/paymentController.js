const Razorpay = require('razorpay');
const crypto = require('crypto');
const Portfolio = require('../models/Portfolio');
const generateSlug = require('../utils/generateSlug');

// Initialize Razorpay instance with environment keys
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.trim() : '',
    key_secret: process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.trim() : ''
});

// Create a Razorpay order for ₹69 (6900 paise)
const createOrder = async (req, res) => {
    try {
        const { portfolioId } = req.body;

        if (!portfolioId) {
            return res.status(400).json({ message: 'Portfolio ID is required' });
        }

        const portfolio = await Portfolio.findOne({ _id: portfolioId, userId: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found or unauthorized' });
        }

        // If already paid, return status
        if (portfolio.isPaid && portfolio.isPublished && portfolio.slug) {
            const frontendUrl = process.env.FRONTEND_URL || 'https://flexoraa-lovat.vercel.app';
            const liveUrl = `${frontendUrl}/portfolio/${portfolio.slug}`;
            return res.status(200).json({
                alreadyPaid: true,
                message: 'Portfolio is already published',
                portfolio,
                liveUrl
            });
        }

        const amountInPaise = 200; // ₹69.00 = 6900 paise

        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: `rcpt_${portfolioId.toString().substring(0, 10)}_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.trim() : ''
        });

    } catch (error) {
        console.error('Create Razorpay order error:', error);
        res.status(500).json({ message: 'Failed to create payment order', error: error.message });
    }
};

// Verify Razorpay payment signature & publish portfolio
const verifyPayment = async (req, res) => {
    try {
        const { portfolioId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!portfolioId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'All payment parameters are required' });
        }

        const portfolio = await Portfolio.findOne({ _id: portfolioId, userId: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found or unauthorized' });
        }

        // Verify Razorpay SHA256 signature
        const secret = process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.trim() : '';
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid payment signature. Verification failed.' });
        }

        // Mark portfolio as paid & published
        if (!portfolio.slug) {
            const name = portfolio.structuredData?.name || portfolio.portfolioContent?.name || 'portfolio';
            portfolio.slug = generateSlug(name);
        }

        portfolio.isPaid = true;
        portfolio.paymentId = razorpay_payment_id;
        portfolio.isPublished = true;
        await portfolio.save();

        const frontendUrl = process.env.FRONTEND_URL || 'https://flexoraa-lovat.vercel.app';
        const liveUrl = `${frontendUrl}/portfolio/${portfolio.slug}`;

        res.status(200).json({
            message: 'Payment verified and portfolio published successfully!',
            portfolio,
            liveUrl
        });

    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ message: 'Payment verification failed', error: error.message });
    }
};

module.exports = { createOrder, verifyPayment };
