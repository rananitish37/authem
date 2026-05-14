const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const encryptedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = encryptedPassword;
    const user = new User(userData);
    await user.save();
    res.send("Data saved successfully in database");
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("User email not found");
    }
    const validUser = await user.validatePassword(password);
    if (validUser) {
      const token = await user.getJWT();
      if (!token) {
        throw new Error("Not able to generate token");
      }
      res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "strict"
      });
      const response = {
        message: "Logged in Successfully!",
        status: user.isActive,
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      };
      res.status(200).send(response);
    } else {
      throw new Error(" Invalid credential");
    }
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
};

const profile = async (req, res) => {};

module.exports = {
  registerUser,
  loginUser,
  profile,
};
