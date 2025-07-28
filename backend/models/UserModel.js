const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name : {type :String, required:true},
    email : { type:String, required:true, unique:true},
    password : {type:String, required:true},
    phone : {type: Number, match:[/^\d{10}$/, 'Please enter a valid mobile number']},
    role : {type:String, enum:['admin', 'customer'], default:'customer' },
    profilePicture: {
    url: String,
    public_id: String
    },
})

module.exports = mongoose.model('User',UserSchema)