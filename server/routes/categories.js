
const express=require("express");
const pLimit=require("p-limit").default;
const { Category } = require('../models/category');

const cloudinary=require("cloudinary").v2
const router=express.Router();



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


router.get('/',async (req,res)=>{
     
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const totalPosts = await Category.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);
    

    
    if (page > totalPages) {
        return res.status(404).json({ message: "Page not found" })
    }
    const categoryList=await Category.find()
  
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();


    if(!categoryList){
        res.status(500).json({success:false})
    }
   return res.status(200).json({
    "categoryList": categoryList,
    "totalPages": totalPages,
    "page": page
});
});
router.post("/create", async (req, res) => {
    try {
        // 1. Check if images exist in the request
        if (!req.body.images || !Array.isArray(req.body.images)) {
            return res.status(400).json({ success: false, message: "No images provided" });
        }

        const limit = pLimit(2);
        const imagesToUpload = req.body.images.map((image) => {
            return limit(async () => {
                const result = await cloudinary.uploader.upload(image);
                return result;
            });
        });

        const uploadStatus = await Promise.all(imagesToUpload);
        const imgUrl = uploadStatus.map((item) => item.secure_url);

        let category = new Category({
            name: req.body.name,
            images: imgUrl,
            color: req.body.color
        });

        category = await category.save();
        res.status(201).json(category);

    } catch (err) {
        // This catches Cloudinary errors or DB errors
        res.status(500).json({
            error: err.message || "Internal Server Error",
            success: false
        });
    }
});


router.delete('/:id', async (req, res) => {
  const deletedUser = await Category.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    return res.status(404).json({
      message: 'Category not find!',
      success: false
    });
  }

  res.status(200).json({
    success: true,
    message: 'Category Deleted!'
  });
});




router.put('/:id', async (req, res) => {
    const limit=pLimit(2);
    const imagesToUpload=req.body.images.map((images)=>{
        return limit(async ()=>{
            const result = await cloudinary.uploader.upload(images);
            return result;

        })
    });
    const uploadStatus = await Promise.all(imagesToUpload)
    const imgUrl = uploadStatus.map((item)=>{
        return item.secure_url
    })
    if(!uploadStatus){
        return res.status(500).json({
            error:"images can not upload",
            status:false
            
            
            
        })
    }


    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
        images:imgUrl,
        color:req.body.color
        },
        { new: true }
    )

    if (!category) {
        return res.status(500).json({
            message: 'Category cannot be updated!',
            success: false
        })
    }
    res.send(category);
});
 router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({
            message: 'The category with the given ID was not found.'
        });
    }

    return res.status(200).send(category);
});


    
   

module.exports=router;