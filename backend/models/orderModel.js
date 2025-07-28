// const mongoose = require('mongoose');

// const OrderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   items: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required:false },
//       selectedColor: String,
//       quantity: Number,
//       price: Number,

//       custom: { type: Boolean, default: false },
//       flowerCount: Number,
//       wrapperColor: String,
//       flowerColor: [String],
//       selectedDecorations: [String],
//       makingCostFree: Boolean,
//       totalPrice: Number,
//     },
//   ],
//   totalAmount: Number,
//   paymentMode: String,
//   deliveryAddress: {
//     name: String,
//     email: String,
//     contact: String,
//     alternativeContact: String,
//     houseno: String,
//     address: String,
//     city: String,
//     pincode: String,
//   },
//   coupon: String,
//   discountAmount: Number,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('Order', OrderSchema);

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      selectedColor: String,
      quantity: Number,
      price: Number
    }
  ],
  customItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomProduct' },
      flowerCount: Number,
      flowerColor: [String],
      wrapperColor: String,
      selectedDecorations: [String],
      makingCostFree: Boolean,
      totalPrice: Number,
      price: Number,
      selectedColor: String,
      quantity: Number
    }
  ],
  totalAmount: Number,
  paymentMode: String,
  deliveryAddress: {
    name: String,
    address: String,
    city: String,
    pincode: String,
    phone: String
  },
  coupon: String,
  discountAmount: Number,
  orderStatus: { type: String, default: 'Ordered' },
  orderDate: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Order', OrderSchema);
