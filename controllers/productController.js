const Product = require('../models/productModel')
const fs = require('fs')
const path = require('path')


//Get All Products
const getProducts = async(req,res)=>{
    try {
        const data = await Product.find({}).populate(["Shop","createdBy","Category"])
        if(data){
            res.status(200).send({success:true,data:data})
        }
        else{
            res.status(200).send({success:false,message:"Unable To Load Products"})

        }
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}




//Get User Products
const userProducts = async(req,res)=>{
    try {
        const data = await Product.find({createdBy:req.user._id}).populate(["Shop","createdBy","Category"])
        if(data){
            res.status(200).send({success:true,data:data})
        }
        else{
            res.status(200).send({success:false,message:"Unable To Load Products"})

        }
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}






//Single Product
const singleProduct = async(req,res)=>{
    const {id} = req.params
    try {
        const data = await Product.findOne({_id:id}).populate(["Shop","createdBy","Category"])
        if(data){
            res.status(200).send({success:true,data:data})
        }
        else{
            res.status(200).send({success:false,message:"No Product Found"})

        }
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}




//Add Products
const addProducts = async(req,res)=>{
    const {Title,Description,Brand,Category,Color,Size,Shop} = req.body
    if(!Title || !Description || !Brand || !Category || !Shop){
        fs.unlinkSync(path.join(__dirname,'../public/ProductImages',req.file.filename));
        
        res.status(200).send({success:false,message:"Some Fields atre missing... Please Check and Try Again"})
}
    else try {
        const data = await Product.find({createdBy:req.user._id})
        if(data.length !== 0){
            let check = false
           for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if(element.Title.toLowerCase() === Title.toLowerCase()){
                fs.unlinkSync(path.join(__dirname,'../public/ProductImages',req.file.filename));

                check=true
                res.status(200).send({success:true,message:"Product With the Same name is not Allowed"})
                break;
            }
            
           }
           if(!check){
            const product = await new Product({
                Title:Title,
                Description:Description,
                Brand:Brand,
                Category:Category,
                Color:Color ? Color :'',
                Size:Size ? Size :'',
                Shop:Shop,
                Image:req.file.filename,
                createdBy:req.user._id

            })
            await product.save()
            res.status(200).send({success:false,message:"Congrats...! Product Created Successfully",data:product})

           }
        }
        else{
            const product = await new Product({
                Title:Title,
                Description:Description,
                Brand:Brand,
                Category:Category,
                Color:Color ? Color :'',
                Size:Size ? Size : '',
                Shop:Shop,
                Image:req.file.filename,
                createdBy:req.user._id

            })
            await product.save()
            res.status(200).send({success:false,message:"Congrats...! Product Created Successfully",data:product})

        }
        
    } catch (error) {
        fs.unlinkSync(path.join(__dirname,'../public/ProductImages',req.file.filename));

        res.status(400).send({success:false,message:error.message})
    }
}





//Delete Products
const deleteProducts = async(req,res)=>{
    const {id}= req.params
    if(!id) res.status(200).send({success:false,message:"Product Id is Missing"})
    else try {
        const data = await Product.findOne({_id:id})
       if(req.admin || req.user._id.toString() === data.createdBy.toString()){
        if(data){
            const imagePath = path.join(__dirname,'../public/ProductImages',data.Image)
            await fs.unlinkSync(imagePath)
            const deldata = await Product.findOneAndDelete({_id:id})
            res.status(200).send({success:true,message:"Product Deleted Successfully",data:deldata})
        }
        else{
            res.status(200).send({success:false,message:"No Product Found Against Your Record"})

        }
       }
       else{
        res.status(200).send({success:false,message:"You are not Authorized To Perform this Action"})
        
       }
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}







//Update Products
const updateProducts = async(req,res)=>{
    const {id}= req.params
    const {Title,Description,Brand,Category,Color,Size,Shop} = req.body

    if(!id && !Title && !Description && !Brand && !Category && !Color && !Size && !Shop) res.status(200).send({success:false,message:"Minimum One Field is Required"})
    else try {
        const data = await Product.findOne({_id:id})
       if(req.admin || req.user._id.toString() === data.createdBy.toString()){
        if(data){
            const deldata = await Product.findOneAndUpdate({_id:id},{$set:{
                Title:Title ? Title : data.Title,
                Description:Description ? Description : data.Description,
                Brand:Brand ? Brand : data.Brand,
                Category:Category ? Category : data.Category,
                Color:Color ? Color : data.Color,
                Size:Size ? Size : data.Size,
                Shop:Shop ? Shop : data.Shop,
                createdBy:data.createdBy
            }},{new:true})
            res.status(200).send({success:true,message:"Product Updated Successfully",data:deldata})
        }
        else{
            res.status(200).send({success:false,message:"No Product Found Against Your Record"})

        }
       }
       else{
        res.status(200).send({success:false,message:"You are not Authorized To Perform this Action"})
        
       }
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}


//Update Products
const updateimageProduct = async(req,res)=>{
    const {id}= req.params

    if(!id) res.status(200).send({success:false,message:"Product ID is Required"})
    if(!req.file.filename) res.status(200).send({success:false,message:"Image is Required to Update"})
    else try {
        const data = await Product.findOne({_id:id})
       if(req.admin || req.user._id.toString() === data.createdBy.toString()){
        if(data){
            const imagePath = path.join(__dirname,'../public/ProductImages',data.Image)
            await fs.unlinkSync(imagePath)
            const deldata = await Product.findOneAndUpdate({_id:id},{$set:{
              Image:req.file.filename
            }},{new:true})
            res.status(200).send({success:true,message:"Product Image Updated Successfully",data:deldata})
        }
        else{
            res.status(200).send({success:false,message:"No Product Found Against Your Record"})

        }
       }
       else{
        res.status(200).send({success:false,message:"You are not Authorized To Perform this Action"})
        
       }
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}






// Exports
module.exports = {
    getProducts,
    userProducts,
    addProducts,
    deleteProducts,
    updateProducts,
    singleProduct,
    updateimageProduct
}