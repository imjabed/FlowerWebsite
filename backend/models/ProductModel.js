const mongoose = require('mongoose')

const ProductModel = new mongoose.Schema({
    productTitle : {type : String, required : true},
    productDescription : {type : String},
    productCategory : {type : String, required : true},
    productStock : {type : Number, default : 0},
    productPrice : {type : Number, required : true},
    productImages: { type: [String], required: false},
    productColor : {type:String},
    productCreatedAt : {type : Date, default : Date.now},
    productGender : {type:String}
})

module.exports = mongoose.model('Product', ProductModel)