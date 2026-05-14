const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Lastname name is required"],
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      minLength: 10,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not a String Password");
        }
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    profilePicture: {
      type: String,
      default: "https://www.abasynisb.edu.pk/storage/faculty/26_1767084224.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Please enter a valid Url");
        }
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.getJWT= async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
    return token;
}
userSchema.methods.validatePassword= async function(inputPassword){
    const user = this;
    const validUser = await bcrypt.compare(inputPassword,user.password);
    return validUser;
}
const User = mongoose.model("User", userSchema)
module.exports = User;