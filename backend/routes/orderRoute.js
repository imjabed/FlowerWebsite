const express = require('express')
const Router = express.Router()
const Cart = require('../models/CartModel')
const Order = require('../models/orderModel')
const verifyToken = require('../middleware/authMiddleware')

Router.post('/place', verifyToken, async(req,res)=>{
    const userId = req.user.id;
    const {deliveryAddress, paymentMode} = req.body;
    try{
        const cart = await Cart.findOne({userId})
        if (!cart || cart.items.length === 0) { return res.status(400).json({message:'Cart is empty'})}

        const totalAmount = cart.items.reduce((acc,item)=> acc + item.quantity * item.price, 0)
        const order = new Order({
            userId,
            items : cart.items,
            totalAmount,
            paymentMode,
            deliveryAddress,
        })
        await order.save();
        await Cart.findOneAndDelete({userId})
        return res.status(201).json({message:'Order is placed!', order})
    }
    catch(err)
    {    
        console.error(err);
        return res.status(500).json({message:'Failed to order'})
    }
})

module.exports = Router;