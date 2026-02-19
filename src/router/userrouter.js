const express=require("express");
const userRouter=express.Router();
const{userauth}=require("../middlewares/auth")
const{ConnectionRequestModel}=require("../models/connectionrequest");
const{User}=require("../models/user")
const requireddata = "firstName lastName age about gender photourl";
userRouter.get("/user/requests/recieved",userauth,
    async (req,res)=>{
        try{
            const loggedinuser=req.user._id;
            const requests=await ConnectionRequestModel.find({
                touserid:loggedinuser,
                status:"interested"
            }).populate("fromuserid",requireddata);
            if(requests.length===0){
                return res.send("sorry you dont have any request yet");
            }

            else{res.json({
                message:"there are you requests",
                requests
            })}


        }catch(err){
            res.status(404).send("soem error occured: "+err)
        }
    }
)
userRouter.get("/user/connections",userauth,async(req,res)=>{
    try{
        const loggedinuser=req.user._id;
        
        const requests=await ConnectionRequestModel.find({
            $or:[
                {fromuserid:loggedinuser,status:"accepted"},
                {touserid:loggedinuser,status:"accepted"}
            ]
        }).populate("fromuserid","firstName lastName age about gender photourl").populate("touserid","firstName lastName age about gender photourl")
        if(requests.length===0){
            return res.send("you dont have any connections yet:( dw")
        }
        data=requests.map((cr)=>{
            if(cr.fromuserid._id.toString()===loggedinuser._id.toString()){
                return cr.touserid;
            }
            else{
                return cr.fromuserid;
            }
        })
     res.json({
        data
     })
       
        


    }catch(err){
        res.status(404).send("some error occurred: "+err)
    }
})

userRouter.get("/feed",userauth,async(req,res)=>{
    try{
        const page=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;
        if(limit>50){
            limit=50;
        }
        const skip=(page-1)*limit;
        const loggedinuser=req.user;
        const requests=await ConnectionRequestModel.find({
            $or:[{fromuserid:loggedinuser._id},
                {touserid:loggedinuser._id}
            ]
        })
        let hiddenuser=new Set();
        hiddenuser.add(loggedinuser._id.toString());
        requests.forEach((data)=>{
                hiddenuser.add(data.touserid.toString());
                hiddenuser.add(data.fromuserid.toString());
        })
        const userinfeed=await User.find({
            _id:{$nin: Array.from(hiddenuser)}
        }).skip(skip).limit(limit);
        if(userinfeed.length===0){
            return res.send(userinfeed)
        }
        res.send(
            userinfeed
        )
    }catch(err){
        res.status(400).send("some error occured:("+err)
    }
})




module.exports={userRouter};