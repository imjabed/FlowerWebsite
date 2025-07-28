const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      selectedColor: { type: String },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  customItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomProduct', required: true }, // ✅ Add this
      selectedColor: { type: String, default: 'Custom' },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true }, // ✅ Add this
      totalPrice: { type: Number, required: true },
      flowerCount: { type: Number, required: true },
      flowerColor: { type: [String], required: true },
      wrapperColor: { type: String, required: true },
      selectedDecorations: [String],
      makingCostFree: Boolean,
      addedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Cart', CartSchema);
