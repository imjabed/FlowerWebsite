const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: 'https://ourflowerwebsite.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ Use only this line for CORS
app.use(cors(corsOptions));

// ❌ Do NOT use app.options('*'...) or app.options('/*'...) — causes crash

// ✅ Optional: fallback for all OPTIONS requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://ourflowerwebsite.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/products', require('./routes/productRoute'));
app.use('/api/cart', require('./routes/cartRoute'));
app.use('/api/order', require('./routes/orderRoute'));
app.use('/api/coupon', require('./routes/couponRoute'));
app.use('/api/user', require('./routes/user'));

// mongoose
mongoose.connect(process.env.DATABASEURL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection failed:", err));

const PORT = process.env.PORT || 5678;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
