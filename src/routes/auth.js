const express = require("express");
const router = express.Router();
const {registerUser,loginUser,profile,logout} = require("../controllers/authController");
const {userAuth} = require("../middleware/auth");


router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",userAuth, profile);
// router.post("/logout",userAuth, logout);
module.exports = router;