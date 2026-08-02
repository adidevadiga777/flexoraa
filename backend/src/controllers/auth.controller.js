const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const blacklistModel = require('../models/blacklist.model')
const { redis } = require('../config/cache');

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 3 * 24 * 60 * 60 * 1000
});

const getFrontendBaseUrl = (req) => {
    const configuredFrontendUrl = process.env.FRONTEND_URL?.trim();
    if (configuredFrontendUrl) {
        return configuredFrontendUrl.replace(/\/$/, '');
    }

    const forwardedProto = req.get('x-forwarded-proto') || req.protocol || 'https';
    const forwardedHost = req.get('x-forwarded-host') || req.get('host');
    if (forwardedHost) {
        return `${forwardedProto}://${forwardedHost}`;
    }

    const origin = req.get('origin') || req.get('referer');
    if (origin) {
        try {
            return new URL(origin).origin;
        } catch (error) {
            console.warn('Unable to parse origin for frontend redirect:', error.message);
        }
    }

    return 'https://www.flexoraa.in';
};

async function registerUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password || !username.trim() || !email.trim() || !password.trim()) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { email: email.toLowerCase() },
            { username: username.toLowerCase() }
        ]
    })

    if (isAlreadyRegistered) {
        return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, {
        expiresIn: "3d"
    })

    res.cookie("token", token, getCookieOptions())

    return res.status(200).json({
        message: "User registered successfully",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

async function loginUser(req, res) {
    const { email, password, username } = req.body;

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const query = [];
    if (email) query.push({ email: email.toLowerCase() });
    if (username) query.push({ username: username.toLowerCase() });

    if (query.length === 0) {
        return res.status(400).json({ message: "Email or username required" });
    }

    const user = await userModel.findOne({
        $or: query
    }).select("+password");
    if (!user) {
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }
    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, {
        expiresIn: "3d"
    })

    res.cookie("token", token, getCookieOptions())

    return res.status(200).json({
        message: "User logged in successfully",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

async function getMe(req, res) {
    try {
        const user = await userModel.findById(req.user.id)
        return res.status(200).json({
            message: "User found",
            user: user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch user"
        })
    }
}

async function logoutUser(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    res.clearCookie("token", getCookieOptions())

    if (token) {
        try {
            await redis.set(token, Date.now().toString(), "EX", 60 * 60);
        } catch (e) {
            console.error("Redis logout error, falling back to database blacklist:", e.message);
        }
        try {
            await blacklistModel.create({ token });
        } catch (dbErr) {
            console.error("Database blacklisting failed:", dbErr.message);
        }
    }

    return res.status(200).json({
        message: "User logged out successfully"
    })
}

async function googleCallback(req, res) {
    const user = req.user;

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, {
        expiresIn: "3d"
    });

    res.cookie("token", token, getCookieOptions());

    // Redirect back to frontend with token parameter for fallback
    const frontendUrl = getFrontendBaseUrl(req);
    res.redirect(`${frontendUrl}/?token=${token}`);
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    googleCallback,
    getFrontendBaseUrl
}