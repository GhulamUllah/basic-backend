const mongoose = require('mongoose')


const CategoryModel =  mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
   
    name:{
        type:String,
        required:true
    },
},{timestamps:true})


//Exports 

module.exports = mongoose.model("Category",CategoryModel)