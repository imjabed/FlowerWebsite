const express = require('express');
const Router = express.Router();
const Product = require('../models/ProductModel');
const verifyAdmin = require('../middleware/adminMiddleware');
const upload = require('../middleware/cloudinaryStorage'); 
const cloudinary = require('cloudinary').v2;

// Add Product
Router.post('/add', verifyAdmin, upload.array('productImages', 5), async (req, res) => {
  try {
    const productData = req.body;

    if (req.files) {
      productData.productImages = req.files.map(file =>  ({ url: file.path, public_id: file.filename }));
    }

    const product = new Product(productData);
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error("Add Error:", err);
    res.status(500).json({ message: 'Failed to add product' });
  }
});

// Show All Products
Router.get('/show', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Show Error:", err);
    res.status(500).json({ message: 'Failed to load all products' });
  }
});

// Show Single Product
Router.get('/show/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.json({ message: 'Product was not found' });
    }
    res.json(product);
  } catch (err) {
    console.error("Single Show Error:", err);
    res.status(500).json({ message: 'Failed to load the product' });
  }
});

// Delete Product
Router.delete('/delete/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    for (const img of product.productImages) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product is deleted' });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: 'Failed to delete the product' });
  }
});

// Update Product
Router.put('/update/:id', verifyAdmin, upload.array('productImages', 5), async (req, res) => {
  try {
    const updates = req.body;

    if (req.files && req.files.length > 0) {
      updates.productImages = req.files.map(file => ({ url: file.path, public_id: file.filename }) ); 
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.status(200).json({ message: 'Product updated', product: updatedProduct });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

module.exports = Router;
