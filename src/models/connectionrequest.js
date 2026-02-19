const mongoose=require("mongoose");
const connectionrequestSchema=new mongoose.Schema({
    fromuserid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    touserid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:
            ["interested","ignored","accepted","rejected"],
           
    
    }
},{
    timestamps:true
})
connectionrequestSchema.pre("save",function(next){
    if(this.fromuserid.equals(this.touserid)){
         throw new Error("cant send request to yourself");
    }
})
connectionrequestSchema.index({fromuserid:1,touserid:1});

const ConnectionRequestModel=mongoose.model("ConnectionRequestModel",connectionrequestSchema);
module.exports={ConnectionRequestModel};