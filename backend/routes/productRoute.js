const express = require('express')
const Router = express.Router()
const Product = require('../models/ProductModel');
const verifyAdmin = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

Router.post('/add', verifyAdmin, upload.array('productImages', 5), async (req, res) => {
  try {
    const productData = req.body;

    if (req.files) {
      productData.productImages = req.files.map(file => file.filename); // save array of filenames
    }

    const product = new Product(productData);
    await product.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add product' });
  }
});

Router.get('/show', async(req,res)=>{
    try{
        const products = await Product.find()
        res.json(products)
    }
    catch(err)
    {
        res.status(500).json({message:'Failed to load all products'})
    }
})

Router.get('/show/:id', async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id)
        if (!product) { return res.json({message : 'Product was not found'})}
        res.json(product)
    }
    catch(err)
    {
        res.status(500).json({message:'Failed to load the product'})
    }
})

Router.delete('/delete/:id',verifyAdmin, async(req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.json({message:'Product is deleted'})
    }
    catch(err)
    {
        res.status(500).json({message:'Failed to delete the product'})

    }
})

Router.put('/update/:id', verifyAdmin, upload.array('productImages', 5), async (req, res) => {
  try {
    const updates = req.body;

    if (req.files && req.files.length > 0) {
      // Replace images (or you can also add logic to append instead of replacing)
      updates.productImages = req.files.map(file => file.filename);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
});


module.exports = Router;