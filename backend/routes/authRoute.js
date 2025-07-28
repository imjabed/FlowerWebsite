const express = require('express')
const Router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/UserModel')
const Otp = require('../models/OtpModel')
const sendOtp = require('../utils/otpSend')

const LoginNotification = require('../utils/loginNotificationMail')

Router.post('/signup', async (req, res) => {
    const { name, email, password, phone, role} = req.body;
    // const role='customer'; 
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. Please login.' });
        }

        const otp = generateOtp();
        await Otp.deleteMany({ email }); 
        const hashedPass = await bcrypt.hash(password, 10); 

        const otpData = new Otp({
            email,
            otp,
            name,
            password: hashedPass,
            phone,
            role
        });

        console.log("OTP details:", {
        email,
        otp,
        name,
        password: hashedPass,
        phone
        });

        await otpData.save();
        await sendOtp(email, otp);

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: 'Failed to initiate signup' });
    }
});


Router.post('/login', async(req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email})
        if(!user) { return res.status(404).json({message:'User not found'})}
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){return res.status(400).json({message:'Invalid Login Details'})}
        const token = jwt.sign(
            {id:user._id,
             role :user.role
            },
            process.env.JWT_SECRET,
            {expiresIn: '2h'}
        )
        const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        // await LoginNotification(user.email, user.name || 'User', loginTime); 
        
        res.json({message:'Login Successful!', token, user: {
            id : user._id,
            name : user.name,
            email : user.email,
            phone : user.phone,
            role : user.role,
            profilePicture: user.profilePicture?.url || null 
        }})
    }
    catch(err){
        res.status(500).json({message:'Internal Server Error | Login Failed'})
    }
})

function generateOtp(){
        return Math.floor(100000 + Math.random() * 900000).toString();
}

Router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpEntry = await Otp.findOne({ email });
        if (!otpEntry || otpEntry.otp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const { name, password, phone, role } = otpEntry;

        const newUser = new User({
            name,
            email,
            password,
            phone,
            role
        });

        await newUser.save();
        await Otp.deleteMany({ email }); 

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'OTP verification failed' });
    }
});



module.exports = Router