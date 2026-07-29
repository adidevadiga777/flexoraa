const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const blacklistModel = require('../models/blacklist.model')
const { redis } = require('../config/cache');

async function registerUser(req, res) {
    const { username, email, password } = req.body;

    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { email },
            { username }
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
    res.cookie("token", token)

    return res.status(200).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });

}

async function loginUser(req, res) {
    const { email, password, username } = req.body;

    const query = [];
    if (email) query.push({ email });
    if (username) query.push({ username });

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
    res.cookie("token", token)

    return res.status(200).json({
        message: "User logged in successfully",
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

    const token = req.cookies.token

    res.clearCookie("token")

    await redis.set(token, Date.now().toString(), "EX", 60 * 60)

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

    res.cookie("token", token);

    // Redirect back to frontend
    const frontendUrl = process.env.FRONTEND_URL || "https://flexoraa-lovat.vercel.app";
    res.redirect(`${frontendUrl}/`);
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    googleCallback
}