const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./config/db")

const app = express();

app.use(express.json());
app.use(cookieParser());

if(connectDB){
    console.log("Connected db successfully");
    app.listen(3000,()=>{
        console.log("Server is running in port 3000")
    })
}else{
    console.log("Unable to connect DB")
}