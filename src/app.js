const express= require ("express");

const app=express();
app.use("/hello",(req,res)=>{
    res.send("hello hello hello")
});
app.use("/test",(req,res)=>{
    res.send("this was a test")
});
app.use((req,res)=>{
    res.send("hello this is my first node server")
});
app.listen(7777,()=>{
    console.log("we are listening to port 7777");
});