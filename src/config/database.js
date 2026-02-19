const mongoose= require("mongoose");
const connectDB= async ()=>{
    await mongoose.connect("mongodb+srv://asdhiramogh_db_user:qpfiRZPS3yENNsEH@amogh.iyww8tq.mongodb.net/devTinder?appName=AMOGH");
};

module.exports={connectDB};