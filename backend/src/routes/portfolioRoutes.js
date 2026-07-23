const express = require('express');
const router = express.Router();
const { getPortfolioBySlug } = require('../controllers/portfolioController');

// No authMiddleware here — this is a public route
router.get('/portfolio/:slug', getPortfolioBySlug);

module.exports = router;