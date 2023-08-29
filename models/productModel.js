const mongoose = require('mongoose')


const productModel =  mongoose.Schema({
    Title:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    Brand:{
        type:String,
        required:true
    },
    Category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    Color:{
        type:String,
    },
    Size:{
        type:String,
    },
    Image:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    Reviews:{
        type:Number,
        
    },
    Shop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop",
        required:true

    }
   

},{timestamps:true})


//Exports 

module.exports = mongoose.model("Product",productModel)