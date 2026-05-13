const express = require("express");
const router = express.Router();
const {registerUser,loginUser,profile} = require("../controllers/authController")


router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",profile);
module.exports = router;