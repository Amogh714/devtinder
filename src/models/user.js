const mongoose= require("mongoose");
const validator=require("validator");
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        maxlength:50,
        match:[
            /^[A-Za-z'-]+$/ ,
            "name cannot contain any number"
        ]
    },
    lastName:{
        type:String,
        maxlength:100
    },
    emailId:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
        validate(v){
            if(!validator.isEmail(v)){
                throw new Error("invalid email given");
            }
        }
        
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        validate(v){
            if(!validator.isStrongPassword(v)){
                throw new Error("password is not strong "+v)
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(v){
            if(!["male","female","other","attack helicopter"].includes(v.toLowerCase())){
                throw new Error("invalid gender")
            }
        }
    },
    photourl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl5UMKpklREIr0fL1SsjTaXc8G3NbfGdGx7g&s"
    },
    about:{
        type:String,
        default:"information about you",
        maxlength:255,
    }
    ,
    skills:{
        type:[String],
    },
    question:{
        type:String,
        required:true,
        default:"hometown"
    },
    answer:{
        type:String,
        lowercase:true,
        required:true
    }
},
{
    timestamps:true
});



userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},"AmoghDEv710###",{expiresIn:"7d"})
    return token;
}

userSchema.methods.ispasswordright=async function(password){
    const user=this;
    const right=await bcrypt.compare(password,user.password);
    return right;
}
const User=mongoose.model("User",userSchema);
module.exports={User};