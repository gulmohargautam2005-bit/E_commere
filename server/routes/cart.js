
const express=require("express");
const pLimit=require("p-limit").default;
// ADD this import at the top
const { Cart } = require('../models/cart'); // ← missing entirely!

const cloudinary=require("cloudinary").v2
const router=express.Router();



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


router.get('/',async (req,res)=>{
     
    const cartList = await Cart.find(req.query); // ← uppercase Cart



    if(!cartList){
        res.status(500).json({success:false})
    }
   return res.status(200).json({
    "cartList": cartList,
  
});
});
router.post("/add", async (req, res) => {
    try {
      const existingItem = await Cart.findOne({
      productId: req.body.productId,
      userId: req.body.userId,
    });

    if (existingItem) {
      return res.status(400).json({ 
        msg: "Item already in cart",
        success: false 
      });
    }

        let cartList = new Cart({
            title: req.body.title,
            image: req.body.image,
            rating: req.body.rating,
            price:req.body.price,
            subtotal:req.body.subtotal,
            quantity:req.body.quantity,
            productId:req.body.productId,
            userId:req.body.userId,

        });

        cartList = await cartList.save();
        res.status(201).json(cartList);

    } catch (err) {
        // This catches Cloudinary errors or DB errors
        res.status(500).json({
            error: err.message || "Internal Server Error",
            success: false
        });
    }
});


router.delete('/clear/:userId', async (req, res) => {
    try {
        await Cart.deleteMany({ userId: req.params.userId });
        return res.status(200).json({
            success: true,
            message: 'Cart cleared successfully!'
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message || "Internal Server Error",
            success: false
        });
    }
});

router.delete('/:id', async (req, res) => {
 
   const deletedItem = await Cart.findByIdAndDelete(req.params.id);
  if (!deletedItem) {
    return res.status(404).json({
      message: 'item not find!',
      success: false
    });
  }

  res.status(200).json({
    success: true,
    message: 'CartItem  Deleted!'
  });
});




router.put('/:id', async (req, res) => {

    const cartList = await Cart.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.name,
            image: req.body.image,
            rating: req.body.rating,
            price:req.body.price,
            subtotal:req.body.subtotal,
            quantity:req.body.quantity,
            productId:req.body.productId,
            userId:req.body.userId,
        },
        { new: true }
    )

    if (!cartList) {
        return res.status(500).json({
            message: 'Cart  cannot be updated!',
            success: false
        })
    }
    res.send(cartList);
});
 router.get('/:id', async (req, res) => {
const cartItem = await Cart.findById(req.params.id);
if (!cartItem) {
  return res.status(404).json({ message: 'Cart item not found.' });
}
return res.status(200).json(cartItem);
 })


    
   

module.exports=router;