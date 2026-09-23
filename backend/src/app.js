const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');

const errorHandler = require('./utils/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const stockRoutes = require('./modules/stock/stock.routes');
const portfolioRoutes = require('./modules/portfolio/portfolio.routes');
const watchlistRoutes = require('./modules/watchlist/watchlist.routes');
const tradingRoutes = require('./modules/trading/trading.routes');

const app = express();

const cookieParser = require('cookie-parser');

app.use(helmet());
app.use(
  cors({
    origin: true, // Need to make this strict in production to allow cookies, e.g. "http://localhost:3000"
    credentials: true,
  })
);
app.use(express.json()); 
app.use(cookieParser());
app.use(passport.initialize());

require('./config/passport-config');

app.use('/api/auth', authRoutes);

// Apply User-Based API Limiter to all authenticated routes
app.use('/api/', apiLimiter);

app.use('/api/users', userRoutes); 
app.use('/api/stocks', stockRoutes); 
app.use('/api/portfolio', portfolioRoutes); 
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/trading', tradingRoutes);

app.use(errorHandler);

module.exports = app;