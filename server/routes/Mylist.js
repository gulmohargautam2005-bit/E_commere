
const express=require("express");

const { mylist } = require('../models/Mylist'); // ← missing entirely!

const cloudinary=require("cloudinary").v2
const router=express.Router();



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


router.get('/',async (req,res)=>{
     
    const MyList = await mylist.find(req.query); // ← uppercase Cart



    if(!MyList){
        res.status(500).json({success:false})
    }
   return res.status(200).json({
    "MyList": MyList,
  
});
});
router.post("/add", async (req, res) => {
    try {
      const Item = await mylist.findOne({
      productId: req.body.productId,
      userId: req.body.userId,
    });

    if (Item) {
      return res.status(400).json({ 
        msg: "Item already in List",
        success: false 
      });
    }
   
        let MyList = new mylist({
            title: req.body.title,
            image: req.body.image,
            rating: req.body.rating,
            price:req.body.price,
            productId:req.body.productId,
            userId:req.body.userId,

        });

        MyList = await MyList.save();
        res.status(201).json(MyList);

    } catch (err) {
        // This catches Cloudinary errors or DB errors
        res.status(500).json({
            error: err.message || "Internal Server Error",
            success: false
        });
    }
});


router.delete('/:id', async (req, res) => {
 
   const Item = await mylist.findByIdAndDelete(req.params.id);
  if (!Item) {
    return res.status(404).json({
      message: 'item not find!',
      success: false
    });
  }

  res.status(200).json({
    success: true,
    message: 'Item  Deleted!'
  });
});





 router.get('/:id', async (req, res) => {
const Item = await mylist.findById(req.params.id);
if (!Item) {
  return res.status(404).json({ message: ' item not found.' });
}
return res.status(200).json(Item);
 })


    
   

module.exports=router;