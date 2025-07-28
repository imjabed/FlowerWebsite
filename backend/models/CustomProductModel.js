const mongoose = require('mongoose');

const CustomProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  flowerCount: Number,
  flowerColor: [String],
  wrapperColor: String,
  selectedDecorations: [String],
  makingCostFree: Boolean,
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CustomProduct", CustomProductSchema);
