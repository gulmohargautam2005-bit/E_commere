const mongoose=require('mongoose')

const MylistSchema = mongoose.Schema({
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

    productId:{
        type:String,
        required:true

    },
    userId:{
        type:String,
        required:true
    }
})
MylistSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

MylistSchema.set("toJSON",{
    virtuals:true,
})

exports.mylist =mongoose.model("mylist",MylistSchema);
exports.MylistSchema=MylistSchema;