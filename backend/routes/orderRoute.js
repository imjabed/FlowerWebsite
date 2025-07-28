const express = require('express');
const Router = express.Router();
const Cart = require('../models/CartModel');
const Order = require('../models/orderModel');
const verifyToken = require('../middleware/authMiddleware');

Router.post('/place', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { deliveryAddress, paymentMode, coupon, discountAmount } = req.body;

  if (!deliveryAddress) {
    return res.status(400).json({ message: 'Delivery address is required' });
  }

  if (!paymentMode) {
    return res.status(400).json({ message: 'Payment mode is required' });
  }

  const requiredAddressFields = ['name', 'address', 'city', 'pincode'];
  for (const field of requiredAddressFields) {
    if (!deliveryAddress[field]) {
      return res.status(400).json({ message: `Delivery address missing ${field}` });
    }
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart || ((!cart.items || cart.items.length === 0) && (!cart.customItems || cart.customItems.length === 0))) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total price
    const regularTotal = (cart.items || []).reduce(
      (acc, item) => acc + (item.price * item.quantity), 0
    );
    const customTotal = (cart.customItems || []).reduce(
      (acc, item) => acc + (item.totalPrice), 0
    );

    const totalAmountRaw = regularTotal + customTotal;
    const totalAmount = totalAmountRaw - (discountAmount || 0);

    const order = new Order({
      userId,
      items: cart.items || [],
      customItems: cart.customItems || [],
      totalAmount,
      paymentMode,
      deliveryAddress,
      coupon,
      discountAmount
    });

    await order.save();

    // Clear cart after placing order
    await Cart.findOneAndDelete({ userId });

    return res.status(201).json({ success: true, message: 'Order placed successfully', order });

  } catch (error) {
    console.error("❌ Order Save Error:", error.message);
    if (error.errors) {
      for (let key in error.errors) {
        console.error(`⛔ Validation error in ${key}:`, error.errors[key].message);
      }
    }
    return res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});


module.exports = Router;
