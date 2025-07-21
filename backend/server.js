const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
require('dotenv').config()



const corsOptions = {
  origin: 'https://ourflowerwebsite.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 


app.use(express.json())


app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/products', require('./routes/productRoute'))
app.use('/api/cart', require('./routes/cartRoute'))
app.use('/api/order', require('./routes/orderRoute'))
app.use('/api/coupon', require('./routes/couponRoute'));

app.use('/api/user', require('./routes/user'))
// const path = require('path');
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.DATABASEURL)
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection failed:", err);

});

const PORT = process.env.PORT || 5678;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



module.exports = app;
