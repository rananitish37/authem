const User = require("../models/user");

const registerUser = async (req,res)=>{
    
    try {
        const userData = req.body; 
        const user = new User(userData);
        console.log(user);
        await user.save();
        res.send("Data saved successfully in database");
    } catch (error) {
        res.status(400).send("Error: "+error);
    }
}

const loginUser=async (req,res)=>{

}

const profile = async (req,res)=>{

}


module.exports = {
    registerUser,
    loginUser,
    profile
}