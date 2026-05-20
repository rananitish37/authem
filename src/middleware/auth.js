const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next)=>{
    try {
        const cookie = req.cookies;
        const {token} = cookie;
        if(!token){
            throw new Error("Token doesn't exist yet, it's missing");
        }
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode._id);
        if(!user){
            throw new Error("Profile not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send("Unauthorized access");
    }
}
const restrictTo = (...roles) => {
    return (req, res, next) => {
        try {
            if(!roles.includes(req.user.role)){
                return res.status(403).send("user not allowed");
            }
            next()
        } catch (error) {
            res.status(403).send("Not authorized");
        }
    }
}

module.exports={
    userAuth,
    restrictTo,
}