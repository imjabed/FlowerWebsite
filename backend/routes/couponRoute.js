const express = require('express')
const Router = express.Router()
const Coupon = require('../models/couponModel')

Router.post('/addcoupon', async(req,res)=>{
    try{
        const newCoupon = new Coupon(req.body);
        await newCoupon.save();
        res.status(201).json({ message: 'Coupon created successfully', coupon: newCoupon });
    }
    catch (err) {
    res.status(400).json({ error: err.message });
  }
})

Router.get('/showcoupon', async(req,res)=>{
    try{
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    }
    catch(err)
    {
        res.status(500).json({ error: err.message });
    }
});


Router.delete('/:id', async(req,res)=>{
    try{
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon deleted successfully' });
    }
    catch(err)
    {
        res.status(500).json({ error: err.message });
    }
})

Router.patch('/:id', async(req,res)=>{
    try{
        const coupon = await Coupon.findById(req.params.id);
        if(!coupon) { return res.status(404).json({ error: 'Coupon not found' }); }
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        res.json({ message: `Coupon ${coupon.isActive ? 'enabled' : 'disabled'}`, coupon });
    }
    catch(err)
    {
        res.status(500).json({ error: err.message });
    }
})

module.exports = Router;
