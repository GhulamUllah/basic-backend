const express = require('express')
const user_route = express()
const bodyParser = require('body-parser')
user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({ extended: true }))
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

user_route.get('/',auth,userController.getUser) // Only admin can Access this Api
user_route.delete('/delete-user/:id',auth,userController.deleteUser)// Only admin can Access this Api
user_route.patch('/update-user',auth,userController.updateUser)
user_route.post('/forget-password',userController.forgetpassword)
user_route.get('/get-forgetotp',userController.getforgetotp)
user_route.post('/signup',userController.Signup)
user_route.post('/login',userController.login)
user_route.post('/resend-otp',userController.resendOTP)
user_route.get('/getsignupotp',userController.getSignupOtp)


//Export
module.exports = user_route