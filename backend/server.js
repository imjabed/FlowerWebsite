const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
require('dotenv').config()

app.use(express.json())
app.use(cors())


app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/products', require('./routes/productRoute'))
app.use('/api/cart', require('./routes/cartRoute'))
app.use('/api/order', require('./routes/orderRoute'))
app.use('/api/coupon', require('./routes/couponRoute'));

app.use('/api/user', require('./routes/user'))
app.use('/uploads', express.static('uploads'));



mongoose.connect(process.env.DATABASEURL)
.then( ()=> {console.log('Database is connected')})
.catch( (err)=>{console.log('Database failed to connect')})

module.exports = app;
