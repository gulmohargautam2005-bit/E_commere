const mongoose=require('mongoose')

const ProductReviewSchema = mongoose.Schema({
    ProductId:{
        type:String,
        required:true
    },
    CustomerName:
        {
            type:String,
            required:true
        }
    ,
    CustomerId:{
        type:String,
        required:true

    },
    CustomerRating:{
        type:Number,
        required:true,
        default:1

    },
    Review:{
        type:String,
        required:true,
        default:""
    },
    
})
ProductReviewSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

ProductReviewSchema.set("toJSON",{
    virtuals:true,
})

exports.productReview =mongoose.model("productReview",ProductReviewSchema);
exports.ProductReviewSchema=ProductReviewSchema;