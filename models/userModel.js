const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        required:true,

        default:"This is my Bio's Section"
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
        default:0,
        required:true
    },
    token:{
        type:String,

        default:''
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String,

        default:''
    },
    role:{
        type:String,
        required:true,

        enum:['admin','seller','buyer'],
        default:"buyer"
    }
},{timestamps:true})


module.exports = mongoose.model("User",userSchema)