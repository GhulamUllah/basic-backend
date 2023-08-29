const Category = require('../models/CategoryModel')


//Get All Categories
const getCategories = async(req,res)=>{
    try {
        const data = await Category.find().populate("User")
        if(data){
            res.status(200).send({success:true,data:data})
        }
        else{
            res.status(200).send({success:false,message:"Unable To Load Categories"})

        }
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}



//Add Categories
const addCategories = async(req,res)=>{
    const {name} = req.body
    if(!name) res.status(200).send({success:false,message:"Category Name is Required"})
    else try {
        const data = await Category.find()
        if(data.length > 0){
            let check = false
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if(element.name.toLowerCase() === name.toLowerCase()){
                    check = true
                    res.status(200).send({success:false,message:"Category Already Exist"})
                    break;
                }
                
            }
            if(!check){
                const category = await new Category({
                    User:req.user._id,
                    name:name
            
                  })
                  await category.save()
                  res.status(200).send({success:true,message:"Category Added Successfully",data:category})
            }

        }
        else{
            const category = await new Category({
                User:req.user._id,
                name:name
        
              })
              await category.save()

              res.status(200).send({success:true,message:"Category Added Successfully",data:category})
        }
     
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}




//Delete Categories
const deleteCategories = async(req,res)=>{
    const {id}=req.params
    if(!id) res.status(200).send({success:false,message:"Category Id is Required To Delete"})
    else try {
        const data = await Category.findOne({_id:id})
        if(req.admin || req.user._id.toString() === data.User.toString()){
            if(data){
                const deldata = await Category.findOneAndDelete({_id:id})
                res.status(200).send({success:true,message:"Category Deleted Successfully",data:deldata})
            }
            else{
                res.status(200).send({success:false,message:"No Category Found"})
    
            }
        }
        else res.status(200).send({success:false,message:"You Are Not Authorized To Delete This Category"})
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}


//Update Categories
const updateCategories = async(req,res)=>{
    const {id}=req.params
    const {name} = req.body
    if(!id) res.status(200).send({success:false,message:"Category Id is Required To Update"})
    else if(!name) res.status(200).send({success:false,message:"Category Name is Required To Update"})
    else {
try {
        console.log("data")

        const data = await Category.findOne({_id:id})
        console.log(data)
        if(req.admin || req.user._id.toString() === data.User.toString()){
            if(data){
                const deldata = await Category.findOneAndUpdate({_id:id},{$set:{name:name}},{new:true})
                res.status(200).send({success:true,message:"Category Updated Successfully",data:deldata})
            }
            else{
                res.status(200).send({success:false,message:"No Category Found"})
    
            }
        }
        else res.status(200).send({success:false,message:"You Are Not Authorized To Update This Category"})
        
    } catch (error) {
        res.status(400).send({success:false,message:error.message})
    }
}
}



//Exports 
module.exports = {
    getCategories,
    addCategories,
    deleteCategories,
    updateCategories
}