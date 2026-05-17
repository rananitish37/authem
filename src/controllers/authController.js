const User = require("../models/user");

const registerUser = async (req, res) => {
  try {
    const {firstName, lastName, email, password, gender, profilePicture, address} = req.body;
    if(!firstName || !email || !password){
        throw new Error("Please enter emailid, password and name");
    }
    const user = new User({
        firstName,
        lastName,
        email,
        password,
        gender,
        profilePicture,
        address
    });
    await user.save();
    const token = await user.getJWT();
      if (!token) {
        throw new Error("Not able to generate token");
      }
      res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });
      const response = {
        message: "User registered successfully",
        status: user.isActive,
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      };
      res.status(200).send(response);
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
        secure: process.env.NODE_ENV === "production",
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
      throw new Error("Invalid credential");
    }
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
};

const profile = async (req, res) => {
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send("Error: " + error);
    }
};


module.exports = {
  registerUser,
  loginUser,
  profile,
  logout,
};
