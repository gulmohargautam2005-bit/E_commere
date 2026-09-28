const mongoose=require('mongoose')
const { type, userInfo } = require('os')
const cartSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:
        {
            type:String,
            require:true
        }
    ,
    rating:{
        type:Number,
        required:true

    },
    price:{
         type:Number,
        required:true

    },
    quantity:{
         type:Number,
        required:true

    },
    subtotal:{
         type:Number,
        required:true

    },
    productId:{
        type:String,
        required:true

    },
    userId:{
        type:String,
        required:true
    }
})
cartSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

cartSchema.set("toJSON",{
    virtuals:true,
})

exports.Cart =mongoose.model("Cart",cartSchema);
exports.cartSchema=cartSchema;