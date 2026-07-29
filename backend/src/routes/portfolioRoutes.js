const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middlewares/auth.middleware');

// Logged-in user's latest portfolio
router.get('/portfolio/me', authMiddleware.authUser, portfolioController.getUserPortfolio);

// All portfolios of logged-in user
router.get('/portfolio/all', authMiddleware.authUser, portfolioController.getAllUserPortfolios);

// Delete a portfolio
router.delete('/portfolio/:id', authMiddleware.authUser, portfolioController.deletePortfolio);

// Owner-only edit — must be logged in and own this portfolio
router.patch('/portfolio/:id/edit', authMiddleware.authUser, portfolioController.editPortfolio);

// Publish portfolio (generate slug and mark as live)
router.post('/portfolio/:id/publish', authMiddleware.authUser, portfolioController.publishPortfolio);

// Existing public view route stays as-is (no authUser)
router.get('/portfolio/:slug', portfolioController.getPortfolioBySlug);

module.exports = router;