const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./config/db")
const authRoutes = require("./routes/auth")

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);

connectDB().then(()=>{
    console.log("Connected db successfully");
    app.listen(3000,()=>{
        console.log("Server is running in port 3000")
    })
}).catch((err)=>{
    console.error("Database connection not established!!", err);
})