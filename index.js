const express = require('express')
const mongoose = require('mongoose')
const user_route = require('./routes/userRoute')
const category_route = require('./routes/categoryRoute')
const shop_route = require('./routes/shopRoute')
const product_route = require('./routes/productRoute')
const app = express()
const cors = require('cors')

// database settings
mongoose.connect('mongodb://127.0.0.1:27017/practice')

// app setting
app.use(cors())
app.use('/user',user_route)
app.use('/category',category_route)
app.use('/shop',shop_route)
app.use('/product',product_route)


app.listen(3,()=>console.log("Server is ready on Port 3"))