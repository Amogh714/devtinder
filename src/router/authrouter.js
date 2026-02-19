const express=require("express");
const authRouter=express.Router();
const{User}=require("../models/user.js");
const{validationatsignup}=require("../utils/validation.js");
const bcrypt=require("bcrypt");
const validator=require("validator")
const jwt=require("jsonwebtoken");
const {userauth}=require("../middlewares/auth.js")
authRouter.post("/signup",async(req,res)=>{
    try{
        const {firstName,lastName,emailId,password,question,answer}=req.body;
         //validating function
         validationatsignup(req);
         //hashing is done here
        const hashedpassword=await bcrypt.hash(password,10)
         const user=new User({
            firstName,
            lastName,
            emailId,
            password:hashedpassword,
            question,
            answer
        });

        await user.save();
        const token = await user.getJWT();
        res.cookie("token", token).send(user);
    }catch(err){
        res.status(500).send("some error occurred"+err);
    }
})

authRouter.post("/login", async(req,res)=>{
    try{
        const{emailId,password}=req.body;
        if(!validator.isEmail(emailId)){
            throw new Error("invalid credentials");
        }
        const user=await User.findOne({emailId});
        if(!user){
            throw new Error("email not present");
        }
        const ispasswordright=await user.ispasswordright(password);
        if(ispasswordright){
            const token=await user.getJWT();
            res.cookie("token",token).send(user);
        }
        else{
            return res.status(404).send("invalid credentials");
        }

    }catch(err){
        res.status(404).send(""+err);
    }
})

authRouter.post("/logout",(req,res)=>{
    const token='';
    res.cookie("token",token);
    res.send("logout successfull")
})

module.exports={authRouter};