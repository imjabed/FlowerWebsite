const mongoose = require('mongoose')
const OrderSchema = new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
    items : [{
                productId : {type:mongoose.Schema.Types.ObjectId, ref:'Product', required:true},
                selectedColor : {type:String, required:true},
                quantity: {type:Number, default:1},
            }],
    totalAmount : {type:Number, default:0, required:true},
    paymentMode : {type:String, enum:['cashondelivery', 'online'], default:'online'},
    deliveryAddress :{
        name: {type:String, required:true},
        email : {type:String},
        contact : {type:Number, required:true},
        alternativeContact :  {type:Number},
        houseno : {type:String},
        address : {type:String},
        city : {type:String},
        pincode : {type:Number, required:true},
    },
    status : {type:'String', enum:['Ordered','Confirmed','Pending', 'Shipped', 'Delivered','Returned'], default:'Pending'},
    orderAt : {type:Date, default:Date.now}
})

module.exports = mongoose.model('Order', OrderSchema);