const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    items: [
        {
            productId : {type:mongoose.Schema.Types.ObjectId, ref:'Product', required:true},
            selectedColor : {type:String},
            quantity: {type:Number, default:1},
            price: { type: Number, required: true },
            addedAt: {type:Date, default:Date.now}
        }
    ],
    customItems: [
        {
            flowerCount: { type: Number, required: true },
            flowerColor: { type: [String], required: true },
            wrapperColor: { type: String, required: true },
            totalPrice: { type: Number, required: true },
            selectedDecorations: [String],
            makingCostFree: Boolean,
            addedAt: { type: Date, default: Date.now }
        }
        ]
})
module.exports = mongoose.model('Cart', CartSchema)