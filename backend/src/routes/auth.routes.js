const { Router } = require("express");
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const passport = require('passport')

const router = Router();

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.get("/get-me", authMiddleware.authUser, authController.getMe)
router.get("/logout", authMiddleware.authUser, authController.logoutUser)

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login' }), authController.googleCallback)

module.exports = router;