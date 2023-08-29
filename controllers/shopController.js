const Shop = require('../models/ShopModel')


//Get All Shops

const getShops = async(req,res)=>{
    if(req.admin){
        try {
            const data = await Shop.find().populate(["User","Category"])
            if(data){
                res.status(200).send({success:true,data:data})
            }
            else{
                res.status(200).send({success:false,message:"No Shop Added Till Now...!"})

            }
        } catch (error) {
            res.status(400).send({success:false,message:error.message})
        }
    }
    else{
        res.status(200).send({success:false,message:"You are not Authorized To Access This Data"})
    }
}


//Get User Shop

const userShop = async(req,res)=>{
    
        try {
            const data = await Shop.find({User:req.user._id}).populate(["User","Category"])
            if(data){
                res.status(200).send({success:true,data:data})
            }
            else{
                res.status(200).send({success:false,message:"You Don't Have any Shop Till Now...!"})

            }
        } catch (error) {
            res.status(400).send({success:false,message:error.message})
        }
    
   
}


//Add Shop

const addShop = async(req,res)=>{
    console.log(req.files)
    const {name,aboutShop,Category,address,phone,business_email} = req.body
    console.log(name,aboutShop,Category,address,phone,business_email)
    if(!name || !aboutShop || !Category || !address || !phone || !business_email) res.status(200).send({success:false,message:"Some Fields are Missing... Please Check and Try again"})
    else try {
            const data = await Shop.findOne({User:req.user._id})
            console.log(data)
            if(data){
                res.status(200).send({success:false,message:"You cannot have more than One Store"})
            }
            else{
                const shop = await new Shop({
                    name:name,
                    logo:req.files['logo'][0].filename,
                    banner:req.files['banner'][0].filename,
                    aboutShop:aboutShop,
                    Category:Category,
                    address:address,
                    phone:phone,
                    business_email:business_email,
                    User:req.user._id
                })
                await shop.save()
                res.status(200).send({success:false,message:"Congrats...!  Your Shop has been Created Successfully",data:shop})

            }
        } catch (error) {
            res.status(400).send({success:false,message:error.message})
        }
    
   
}



//Delete Shop

const deleteShop = async(req,res)=>{

    const {id} = req.params
     try {
            const data = await Shop.findOne({_id:id})
             if(req.admin || req.user._id.toString() === data.User.toString()){ 
                 const deldata = await Shop.findOneAndDelete({_id:id})
            res.status(200).send({success:true,message:"Shop Deleted Successfully",data:deldata})
           }
           else{
            res.status(200).send({success:false,message:"You are not Authorized to Delete this Shop"})
           }
        } catch (error) {
            res.status(400).send({success:false,message:error.message})
        }
    
   
}





//Update Shop

const updateShop = async(req,res)=>{
    const {id} = req.params

    const {name,logo,banner,aboutShop,Category,address,phone,business_email} = req.body

     if(!id) res.status(200).send({success:false,message:"Shop id is Required... Please Check and Try again"})
    else try {
            const data = await Shop.findOne({_id:id})
           if(req.admin || req.user._id.toString() === data.User.toString()){
            const deldata = await Shop.findOneAndUpdate({_id:id},{$set:{
                name:name ? name : data.name,
                logo:logo ? logo : data.logo,
                banner:banner ? banner : data.banner,
                aboutShop:aboutShop ? aboutShop : data.aboutShop,
                Category:Category ? Category : data.Category,
                address:address ? address : data.address,
                phone:phone ? phone : data.phone,
                business_email:business_email ? business_email : data.business_email,
                User:data.User
            }},{new:true})
            res.status(200).send({success:true,message:"Shop Updated Successfully",data:deldata})
           }
           else{
            res.status(200).send({success:false,message:"You are not Authorized to Delete this Shop"})
           }
        } catch (error) {
            res.status(400).send({success:false,message:error.message})
        }
    
   
}







//Exports
module.exports = {
    getShops,
    userShop,
    addShop,
    deleteShop,
    updateShop
}