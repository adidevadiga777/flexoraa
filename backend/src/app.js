const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authRoutes = require("./routes/auth.routes.js");
const cors = require("cors")
const uploadRoutes = require('./routes/uploadRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
require('./config/passport'); // Initialize passport strategy

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://flexoraa-lovat.vercel.app",
    "http://localhost:5173"

].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


app.use("/api/auth", authRoutes);

app.use('/api', uploadRoutes);

app.use('/api', portfolioRoutes);

app.use('/api/payment', paymentRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err.stack || err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? {} : err
    });
});

module.exports = app;