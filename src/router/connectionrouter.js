const express=require("express");
const connectionRouter=express.Router();
const {userauth}=require("../middlewares/auth.js");
const { ConnectionRequestModel } = require("../models/connectionrequest.js");
const {User}=require("../models/user.js");



//api to send connection request
connectionRouter.post("/connection/request/:status/:userid",userauth,async(req,res)=>{
    try{
        const fromuserid=req.user._id;
        const touserid=req.params.userid;
        const status=req.params.status;
        const connectionrequest=new ConnectionRequestModel({
            fromuserid,
            touserid,
            status
        });
        const ifuserexists=await User.findById(touserid)

        if(!ifuserexists){
            throw new Error("user doesn't exist please enter a valid id which exists in the db")
        }
        
        const allowedstatus=["interested","ignored"];
        if(!allowedstatus.includes(status)){
            throw new error("invalid status");
        }

        const duplicaterequest=await ConnectionRequestModel.findOne({
            $or:[{fromuserid,touserid},
            {fromuserid:touserid,touserid:fromuserid }]
            })
        if(duplicaterequest){
            throw new Error("can't send this request either you have request from the reciever or you have already send on request ")
        }


        await connectionrequest.save();
        res.send("connection request send suvccesfully")

    }catch(err){
        res.status(404).send("something went wrong "+err);
    }
})

connectionRouter.post("/connection/review/:status/:requestid",
    userauth,
    async(req,res)=>{
        try{
            loggedinuser=req.user;
            const{status,requestid}=req.params;
            const allowedStatus=["accepted","rejected"];
            if(!allowedStatus.includes(status)){
                throw new Error("Please enter a valid status")
            }
            const connectionrequest=await ConnectionRequestModel.findOne({
                _id:requestid,
                touserid:loggedinuser._id,
                status:"interested"
            })

            if(!connectionrequest){
                throw new Error("request doesn't exist");
            }
            else{
                connectionrequest.status=status;
                const data=await connectionrequest.save();
                res.json({
                    message:"request resolved succesfully",
                    data
                })
            }
        }catch(err){
            res.status(404).send("some error occurred: "+err)
        }
    }
)




module.exports={connectionRouter};