const { Router } = require("express");
const authController = require('../controllers/auth.controller')
const { getFrontendBaseUrl } = authController;
const authMiddleware = require('../middlewares/auth.middleware')
const passport = require('passport')

const router = Router();

const getGoogleCallbackUrl = (req) => {
    const configuredCallback = process.env.GOOGLE_CALLBACK_URL?.trim();
    if (configuredCallback) {
        return configuredCallback.replace(/\/+$/, '');
    }

    const forwardedProto = req.headers['x-forwarded-proto']?.split(',')[0] || req.protocol || 'https';
    const forwardedHost = req.headers['x-forwarded-host']?.split(',')[0] || req.get('host');

    if (forwardedHost) {
        return `${forwardedProto}://${forwardedHost}/api/auth/google/callback`;
    }

    return 'https://flexoraa-1.onrender.com/api/auth/google/callback';
};

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.get("/get-me", authMiddleware.authUser, authController.getMe)
router.get("/logout", authMiddleware.authUser, authController.logoutUser)

// Google OAuth routes
router.get('/google', (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        callbackURL: getGoogleCallbackUrl(req)
    })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', {
        session: false,
        callbackURL: getGoogleCallbackUrl(req),
        failureRedirect: `${getFrontendBaseUrl(req)}/login`
    })(req, res, next);
}, authController.googleCallback)

module.exports = router;