const express  = require('express')
const shop_route = express()
const bodyParser = require('body-parser')
const auth = require('../middleware/auth')
const path = require('path')
const shopController = require('../controllers/shopController')
const multer = require('multer')


shop_route.use(bodyParser.json())
shop_route.use(bodyParser.urlencoded({extended:true}))

//multer Setup
const Storageref = multer.diskStorage({
    destination:(req,file,cb)=>{cb(null,path.join(__dirname,'../public/ShopImages'),(err)=>{if(err) throw err})},
    filename:(req,file,cb)=>{cb(null,Date.now()+'-'+file.originalname,(err)=>{if(err) throw err})}

})
const upload = multer({storage:Storageref})


shop_route.get('/',auth, shopController.getShops)
shop_route.get('/user-shop',auth, shopController.userShop)
shop_route.post('/add-shop',auth,upload.fields([{name:'logo',maxCount:1},{name:'banner',maxCount:1}]),shopController.addShop)
shop_route.delete('/delete-shop/:id',auth, shopController.deleteShop)
shop_route.put('/update-shop/:id',auth, shopController.updateShop)


// Exports
module.exports =  shop_route