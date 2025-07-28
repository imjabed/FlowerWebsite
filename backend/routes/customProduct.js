const express = require('express');
const router = express.Router();
const CustomProduct = require('../models/CustomProductModel');
const verifyToken = require('../middleware/authMiddleware');

router.post('/custom', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const {
      flowerCount,
      flowerColor,
      wrapperColor,
      selectedDecorations,
      makingCostFree,
      totalPrice
    } = req.body;

    const newCustomProduct = new CustomProduct({
      userId,
      flowerCount,
      flowerColor,
      wrapperColor,
      selectedDecorations,
      makingCostFree,
      totalPrice
    });

    const saved = await newCustomProduct.save();
    res.status(201).json({ success: true, customProduct: saved });

  } catch (err) {
    console.error("Custom product creation error:", err.message);
    return res.status(400).json({
      success: false,
      message: "Custom product creation failed",
      error: err.message
    });
  }
});

module.exports = router;
