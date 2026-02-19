const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser");
const {User}=require("../models/user.js");

const userauth=async (req,res,next)=>{
   try{//read the token
   const {token}=req.cookies;
   if(!token){
    return res.status(401).send("ERROR NO TOKEN");
   }
   //verify the token
   const decoded=await jwt.verify(token,"AmoghDEv710###");
   const {_id}=decoded;
   if(!_id){
    throw new Error("no _id present in the token please login again");
   }
   //find is user exist or not
   const user=await User.findById({_id:_id})
   if(!user){
    throw new Error("user not present in the database please sign in first ")
   }
   req.user=user;
   next();
   }
   catch(err){
    return res.status(404).send("autharization failed:("+err.message)
   }

}


module.exports={userauth};