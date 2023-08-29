const express = require('express')
const bodyParser = require('body-parser')
const auth = require('../middleware/auth')
const productController = require('../controllers/productController')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const product_route = express()


product_route.use(bodyParser.json())
product_route.use(bodyParser.urlencoded({extended:true}))

// Multer Setup

const Storageref = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,`../public/ProductImages/`),(error)=>{if(error) throw error})
    },
    filename:(req,file,cb)=>{
        const name =Date.now()+'-'+file.originalname
        cb(null,name,(err)=>{if(err) throw err})
    }
})

const upload = multer({storage:Storageref})


product_route.get('/',productController.getProducts)
product_route.get('/user-products',auth,productController.userProducts)
product_route.get('/single-product/:id',productController.singleProduct)
product_route.post('/add-product',auth,upload.single('Image'),productController.addProducts)
product_route.delete('/delete-product/:id',auth,productController.deleteProducts)
product_route.put('/update-product/:id',auth,productController.updateProducts)
product_route.put('/update-product-image/:id',auth,upload.single('Image'),productController.updateimageProduct)


//Exports
module.exports = product_route