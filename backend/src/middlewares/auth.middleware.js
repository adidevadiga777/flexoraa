const blacklistModel = require('../models/blacklist.model');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { redis } = require('../config/cache');

async function authUser(req, res, next) {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const isTokenInBlacklist = await redis.get(token)
    if (isTokenInBlacklist) {
        return res.status(401).json({
            message: "invalid token"
        })
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
        )

        req.user = decoded

        next()

    } catch (err) {
        console.error('JWT Verification Error:', err.message, 'Token:', token);
        return res.status(401).json({
            message: "Invalid token"
        })
    }



}

module.exports = { authUser }