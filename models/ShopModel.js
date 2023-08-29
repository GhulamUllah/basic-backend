const mongoose = require('mongoose')


const ShopModel = mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    logo:{
        type:String,
        required:true,
    },
    banner:{
        type:String,
        required:true
    },
    aboutShop:{
        type:String,
        required:true
    },
    Category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    business_email:{
        type:String,
        required:true
    }
},{timestamps:true}) 

module.exports = mongoose.model("Shop",ShopModel)