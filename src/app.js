const express= require ("express");
const app=express();
const {connectDB}=require("./config/database");
const cookieParser=require("cookie-parser");
const{authRouter}=require("./router/authrouter.js")
const{profileRouter}=require("./router/profilerouter.js")
const{connectionRouter}=require("./router/connectionrouter.js")
const{userRouter}=require("./router/userrouter.js")
const cors=require("cors")
app.use(cors({
    origin: "http://16.170.228.138:5173",
    credentials:true
  })
);
// api to convert allthe json data into js objects
app.use(express.json());
//api to parse cookies
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRouter);
app.use("/",userRouter);


connectDB()
    .then(()=>{
    console.log("connection established successfully")
    app.listen(7777,()=>{
        console.log("successfully connected to 7777 port number");
    })
})
.catch((err)=>{
    console.log("connection to the database failed");
});




