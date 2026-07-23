const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authRoutes = require("./routes/auth.routes.js");
const cors = require("cors")
const uploadRoutes = require('./routes/uploadRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');

const app = express();
require('./config/passport'); // Initialize passport strategy

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/api/auth", authRoutes);

app.use('/api', uploadRoutes);

app.use('/api', portfolioRoutes);


module.exports = app;