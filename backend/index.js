require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const passport = require('passport');

const authRoutes = require('./Routes/authRoutes');

const app = express();
const port = process.env.PORT || 8080;

// --- Middleware ---
app.use(cors());
app.use(express.json()); 
app.use(cookieParser());
app.use(passport.initialize());
require('./config/passport-config.js');

app.use("/api/auth", authRoutes);

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));

// --- Route Imports ---
const holdingRoutes = require('./Routes/holdingRoutes.js');
const positionRoutes = require('./Routes/positionRoutes.js');
const orderRoutes = require('./Routes/orderRoutes.js');
const watchlistRoutes = require('./Routes/watchlistRoutes.js');
const fundRoutes = require('./Routes/fundRoutes.js');
const initRoutes = require('./Routes/initRoutes.js'); 

// --- API Routes ---
app.use("/api/holdings", holdingRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/funds", fundRoutes);

app.use("/api/init", initRoutes);

app.listen(port, () => {
    console.log(`Finvesto server running on http://localhost:${port}`);
});