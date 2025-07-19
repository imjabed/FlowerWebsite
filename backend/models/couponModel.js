const mongoose = require('mongoose')
const couponSchema = new mongoose.Schema({
    name:String,
    code:{type:String, unique:true},
    discountType: { type: String, enum: ["amount", "percentage"], required: true },
    discountValue: Number,
    category: String,
    gender: { type: String, enum: ["Him", "Her"], required:true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Coupon', couponSchema);

