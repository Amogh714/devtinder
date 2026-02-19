const express=require("express");
const profileRouter=express.Router();
const {userauth}=require("../middlewares/auth.js")
const{updateProfileValidation}=require("../utils/validation.js");
const { User } = require("../models/user.js");
const validator=require("validator")
const bcrypt=require("bcrypt")

//api to get profile
profileRouter.get("/profile/view",userauth,async (req,res)=>{
    try{
        const user=req.user;
        res.send(user);
    }
    catch(err){
        res.status(404).send("something went wrong "+err);
    }
    }
)
profileRouter.patch("/profile/update",userauth,async(req,res)=>{
    try{
        if(!updateProfileValidation(req)){
            throw new Error("please enter valid feilds to update")
        }
        const loggedinuser=req.user;
        
        await User.findByIdAndUpdate({_id:loggedinuser._id},req.body);
        const user=await User.findById(loggedinuser._id)
        res.send(user);

    }catch(err){
        res.status(401).send("some error occurred"+err);
    }
})
profileRouter.patch("/profile/forgotpassword",async(req,res)=>{
    try{
    const{emailId,password,answer}=req.body;
    if(!validator.isEmail(emailId)){
        throw new Error("enter a valid emailid");
    }
     const user=await User.findOne({emailId:emailId});
     if(!user){
        throw new Error("user with this email id doesn't exist");
     }
     const hashed=await bcrypt.hash(password,10);
     console.log(hashed);
     if(user.answer===answer){
        user.password=hashed;
        await user.save();
        res.send("password changed successfully:)")
     }
    }catch(err){
        res.status(404).send("some error occurred: "+err)
    }

})
module.exports={profileRouter};