const express = require('express')
const Router = express.Router()
const Cart = require('../models/CartModel')
const Product = require('../models/ProductModel')

const verifyToken = require('../middleware/authMiddleware')

Router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.status(200).json({
        cart: {
          items: [],
          customItems: [],
        },
      });
    }

    res.status(200).json({ cart });
  } catch (err) {
    console.error('Failed to fetch cart:', err);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

Router.post('/add',verifyToken, async(req,res)=>{
    const userId = req.user.id
    const {productId,selectedColor, quantity} =req.body;
    try{
        const product = await Product.findById(productId);
        if(!product) { return res.status(404).json({message:'Product Not Found'})}

        const price = product.productPrice;
        let cart = await Cart.findOne({userId})
        if (!cart) {
            cart = new Cart({
                userId,
                items : [{productId,selectedColor, quantity,price}]
            })
        }
        else{
            const existingProduct = cart.items.findIndex( item => 
                item.productId.toString() === productId && item.selectedColor === selectedColor
            )
            if (existingProduct > -1)
            {
                cart.items[existingProduct].quantity += Number(quantity)
            }
            else{
                cart.items.push({productId, selectedColor, quantity, price})
            }
        }
        await cart.save()
        res.status(201).json({message:'Item is added to cart', cart})
    }
    catch(err)
    {
        res.status(500).json({message:'Failed to add product to cart'})
    }
})

Router.post('/custom', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const {
    productId,  
    flowerCount,
    flowerColor,
    wrapperColor,
    selectedDecorations,
    makingCostFree,
    totalPrice,
    price,           
    selectedColor = "Custom", 
    quantity = 1     
  } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, customItems: [] });
    }
    cart.customItems.push({
      flowerCount,
      flowerColor,
      wrapperColor,
      selectedDecorations,
      makingCostFree,
      totalPrice,
      productId,    
      price,        
      selectedColor,
      quantity
    });
    await cart.save();
    res.status(201).json({ message: 'Custom bouquet added to cart', cart });
  } catch (err) {
    console.error("❌ Failed to add custom item to cart:", err);
    res.status(500).json({ message: 'Failed to add custom bouquet', error: err.message });
  }
});

Router.delete('/item/:itemId', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.status(200).json({ message: 'Item removed successfully', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove item' });
  }
});

Router.delete('/custom/:customId', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const customId = req.params.customId;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const originalLength = cart.customItems.length;
    cart.customItems = cart.customItems.filter(item => item._id.toString() !== customId);

    if (cart.customItems.length === originalLength) {
      return res.status(404).json({ message: 'Custom item not found in cart' });
    }

    // Explicitly mark customItems as modified if needed
    cart.markModified('customItems');

    await cart.save();
    res.status(200).json({ message: 'Custom bouquet removed', cart });
  } catch (err) {
    console.error("❌ Custom delete error:", err);
    res.status(500).json({ message: 'Failed to remove custom bouquet', error: err.message });
  }
});


module.exports = Router