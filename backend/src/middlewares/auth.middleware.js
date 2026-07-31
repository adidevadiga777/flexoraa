const blacklistModel = require('../models/blacklist.model');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { redis } = require('../config/cache');

async function authUser(req, res, next) {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
        const headerToken = req.headers.authorization.split(' ')[1];
        if (headerToken && headerToken !== 'null' && headerToken !== 'undefined') {
            token = headerToken;
        }
    }

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    if (token) {
        try {
            const isTokenInBlacklist = await redis.get(token);
            if (isTokenInBlacklist) {
                return res.status(401).json({ message: "Invalid token" });
            }
        } catch (e) {
            console.error("Redis blacklist check failed, falling back to database check:", e.message);
            try {
                const isTokenInDbBlacklist = await blacklistModel.findOne({ token });
                if (isTokenInDbBlacklist) {
                    return res.status(401).json({ message: "Invalid token" });
                }
            } catch (dbErr) {
                console.error("Database blacklist check failed:", dbErr.message);
            }
        }
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