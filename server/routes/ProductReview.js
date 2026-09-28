const express = require('express');
const { productReview} = require('../models/ProductReview');
const authJwt = require('../middleware/authJwt');
const router = express.Router();

router.get("/",async(req,res)=>{
    try{
        if(req.query.ProductId!==undefined && req.query.ProductId!=="" && req.query.ProductId!==null)
        {
            reviews = await productReview.find({ ProductId: req.query.ProductId })
        }
        else{
            reviews=await productReview.find();
        }
        if(!reviews){
            res.status(500).json({success:false})
        }
        return res.status(200).json(reviews)

    } catch (err) {
        // This catches  DB errors
        res.status(500).json({
            error: err.message || "Internal Server Error",
            success: false
        });
    }

})
router.get("/:id",async(req,res)=>{
    const reviews = await productReview.findById(req.params.id)
    if(!reviews){
        return res.status(500).json({msg:"the review with the given id not found"})
    }
    return res.status(200).json(reviews)
})
router.post("/add", authJwt, async(req,res)=>{
    let review = new productReview({
        ProductId:req.body.ProductId,
        CustomerName:req.body.CustomerName,
        CustomerId:req.body.CustomerId,
        CustomerRating:req.body.CustomerRating,
        Review:req.body.Review,
    })
    if(!review){
        return res.status(500).json({success:false})
    }
    review = await review.save();
    res.status(201).json(review)
})
module.exports = router;
