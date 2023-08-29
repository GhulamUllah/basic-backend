const jwt = require('jsonwebtoken')
const config = require('../config/config')
const User = require('../models/userModel')


const verifyToken = async(req,res,next)=>{
    try {
        const token = req.body.token || req.query.token || req.headers['auth']
        if(!token){

            res.status(200).send({success:false,message:"You cannot access this Api without Login"})

        }
        else{
            const user_id = await jwt.verify(token,config.mySecretKey)
            if(user_id){
                const user = await User.findOne({_id:user_id._id})
                if(user){
                    if(user.role === 'admin'){
                        req.admin = user
                        next()
                    }
                    else{
                        req.user = user
                    next()
                    }
                }
                else{
                    res.status(200).send({success:false,message:"invalid Token"})
                }
            }
        }
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}

module.exports = verifyToken