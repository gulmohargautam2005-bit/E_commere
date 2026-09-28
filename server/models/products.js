const mongoose=require("mongoose");
const productSchema=mongoose.Schema({
name:{
    type:String,
    required:true,

},
description:
{
    type:String,
    required:true,
},
brand:{
    type:String,
    required:true,
},
price:{
    type:Number,
    default:0,
},
catName:{
    type:String,
},
subCat:{
    type:String,
},
productRam: [{
  type: String
}],
productSize: [{
  type: String
}],
productWeight: [{
  type: String
}],
discount:{
    type:Number,
    default:0,
},
category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required:true,

},
subcategory:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'SubCategory',
    required:true,

},
countInstock:{
    required:true,
    type:Number,
},
images:[{
    type:String,
    required:true,
}],
rating: {
    type: Number,
    default: 0,
},

isFeatured: {
    type: Boolean,
    default: false,
}

})
exports.Product = mongoose.model('Product', productSchema);
