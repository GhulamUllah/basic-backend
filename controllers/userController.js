const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const otpgenrator = require('randomstring')
const nodemailer = require('nodemailer')
// some importent Functions
// Number 1 is bcrypt
const passhash = async (password) => {
    const p = await bcrypt.hash(password, 12)
    return p
}

// Number 2 is genrating tokken
const tokengenrator = async (id) => {
    const token = await jwt.sign({ _id: id }, config.mySecretKey)
    return token
}

// Email Sending 
const emailSender = async (otp, email, name) => {
    //nodemailer setup
    const ready = await nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        requireTLS: true,
        secure: false,
        auth: {
            user: config.myEmail,
            pass: config.myPassword
        }
    })

 await ready.sendMail({
        from: config.myEmail,
        to: email,
        subject: 'Email OTP Verification',
        html: `<div style="background-image:linear-gradient(45deg,#f1f1f1,#f3f33f);color:white; height:300px;width:500px;display:flex;align-items:center;text-align:center">
    <p >Hello ${name}...! Your Verification Link is <b style="color:red"> <a href="http://localhost:6000/user/getsignupotp?otp=${otp}&email=${email}">verify</a></b></p>
    </div>`
    }, (err, success) => {
       
         if(success){
            
            return success.response
        }
        else if (err) {
            console.log(err)
        }

    })

}


const Signup = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(200).send({ success: false, message: "All Fields are required" })
    }
    else{
        
    try {
        const data = await User.findOne({ email: email })
        if (data) {
            res.status(200).send({ success: false, message: "email Already Registered..! Login to continue" })
        }
        else {
            let otp = await otpgenrator.generate()

             await emailSender(otp,email,name)
            

            otp = await passhash(otp)


            let p = await passhash(password)

            const user = await new User({
                name: name,
                email: email,
                password: p,
                otp: otp
            })
            await user.save()
            res.status(200).send({ success: true, message: "Congrats...! Your account has been created Successfully", data: user })
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message })
    }
    }
}

// get otp logic
const getSignupOtp = async(req,res)=>{
    try {
        const {otp,email} = req.query
        const getuser = await User.findOne({email:email})
        if(getuser){
            if(!getuser.otp){
                res.status(200).send({success:false,message:"Your Otp is in valid"})
            }
           else{
            let verify = await bcrypt.compare(otp,getuser.otp)
            if(verify){
        const updated = await User.findOneAndUpdate({email:email},{$set:{otp:'',isVerified:true}},{new:true})
        await updated.save()
        res.status(200).send({success:true,message:"Your account has been verified successfully",data:updated})

            }
           }
        }
        else{
            res.status(200).send({success:false,message:"user does not exist"})
        }

    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}

// Re-Send Otp
const resendOTP = async(req,res)=>{
    try {
        const {email}=req.query
        const otp = otpgenrator.generate()
        const user_data = await User.findOne({email:email})
       if(user_data){
        await passhash(otp)
        const otpstick = await User.findOneAndUpdate({email:email},{$set:{otp:otp}},{new:true})
        if(otpstick){
            res.status(200).send({success:true,message:"Otp Resend Successfully",data:otpstick})
        }
        else{
            res.status(200).send({success:false,message:"Cannot Send Otp... Check your details and try again"})
        }
       }
       else{
        res.status(200).send({success:false,message:'No details Found against your data, Please Check and try again'})
       }

    } catch (error) {
        res.status(400).send({success:false,message:error.message})
        
    }
}


// Login Api
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const data = await User.findOne({ email: email })
        if (data) {

            // bcrypt promise will give us boolean value
            let pass = await bcrypt.compare(password, data.password)
            if (pass) {
                const token = await tokengenrator(data._id)
                const userlogin = await User({
                    email: data.email,
                    password: data.password,
                    name: data.name,
                    balance: data.balance,
                    token: token

                })

                res.status(200).send({ success: true, message: "Logged in Successfully", data: userlogin })
            }
            else {
                res.status(200).send({ success: false, message: "Password did not match" })
            }
        }
        else {
            res.status(200).send({ success: false, message: "Email is Not Registerd" })
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message })
    }
}


//Get users
const getUser  =  async(req,res)=>{
   if(req.admin){
    try {
        const user_data = await User.find()
        if(user_data){
            res.status(200).send({success:true,data:user_data})
        }
        else{
            res.status(200).send({success:true,message:'No user has been registerd yet'})
        }
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
   }
   else{
res.status(400).send({success:false,message:"Only Admin can Access this API"})
   }
}

//forget password
const forgetpassword = async(req,res)=>{
    try {
        const {email}= req.body
        const otp = otpgenrator.generate()
        const user_data = await User.findOne({email:email})
        if(user_data){
         await passhash(otp)
         const otpstick = await User.findOneAndUpdate({email:email},{$set:{otp:otp}},{new:true})
         if(otpstick){
             res.status(200).send({success:true,message:"Otp Send Successfully... Please Check Your email",data:otpstick})
         }
         else{
             res.status(200).send({success:false,message:"Cannot Send Otp... Check your details and try again"})
         }
        }
        else{
         res.status(200).send({success:false,message:'No details Found against your data, Please Check and try again'})
        }

    } catch (error) {
        res.status(400).send({success:false,message:error.message}) 
    }
}


//Get forgetotp
const getforgetotp = async(req,res)=>{
    const {otp,email}=req.query
    if(!otp){
        res.status(200).send({success:false,message:'Cannot get otp from Query'})
    }
    const {password,confirmpassword} = req.body
    if(password !== confirmpassword){
        res.status(200).send({success:false,message:"Password did not match"})
    }
    else{
        try {
            const user_data = await User.findOne({email:email})
            if(user_data){
            const otpCheck = await bcrypt.compare(otp,user_data.otp)
            if(otpCheck){
                const updated = await User.findOneAndUpdate({email:email},{$set:{password:password,otp:''}},{new:true})
                if(updated){
                    await updated.save()
                    res.status(200).send({success:true,message:"Congrats...! Your Password has been Changed Successfully",data:updated})
                }
                else{
                    res.status(200).send({success:false,message:"Something went Wrong Check your details and try again...!",data:updated})

                }
            }
            else{
                res.status(200).send({success:false,message:"Otp mismatch"})
            }

            }
            else{
                res.status(200).send({success:false,message:"No user Found against Your Record"})
            }
        } catch (error) {
        res.status(400).send({success:false,message:error.message}) 
            
        }
    }
}



//update user
const updateUser = async(req,res)=>{
    try {
        const {password,name,bio}=req.body
        
        const {email}=req.user
        const user_data = await User.findOne({email:email})
        if(user_data){
            let pass= await passhash(password) 
            const update = await User.findOneAndUpdate({email:email},{$set:{
                password:pass ? pass : user_data.password,
                name:name ? name : user_data.name,
                bio:bio ? bio : user_data.bio 
            }},{new:true})
            if(update){
                await update.save()
            res.status(200).send({success:true,message:"Your Record has been updated Successfully",data:update})

            }
            else{
                res.status(200).send({success:false,message:"Something Went Wrong Check Your Details and try again"})
            }
        }
        else{
            res.status(200).send({success:false,message:"No User Found"})
        }
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message}) 
        
    }
}

//delete user
const deleteUser = async(req,res)=>{
    const {id}=req.params
    if(req.admin){
       try {
        const delete_data = await User.findByIdAndDelete({_id:id})
        if(delete_data){
            res.status(200).send({success:true,message:"User Deleted Successfully",data:delete_data})
        }
        else{
            res.status(200).send({success:false,message:"Something went wrong check your details and try again"})
        }
       } catch (error) {
        res.status(400).send({success:false,message:error.message})
       }
    }
    else{
        res.status(200).send({success:false,message:"Only admin can Delete User"})
    }
}


//Exports
module.exports = {
    Signup,
    login,
    getSignupOtp,
    getUser,
    resendOTP,
    forgetpassword,
    getforgetotp,
    updateUser,
    deleteUser
}