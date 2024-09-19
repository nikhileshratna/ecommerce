const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.googleAuth = async (req, res) => {
  try {
    const { uid, name, email, profilePic } = req.body;

    // Check if user already exists
    let user = await userModel.findOne({ email });

    if (user) {
      // User exists, log them in
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.TOKEN_SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User logged in successfully with Google`,
      });
    } else {
      // Hash the uid to store as password
      const hashedUid = await bcrypt.hash(uid, 10);

      // Create a new profile
      const profile = new Profile({
        gender: "",
        dateOfBirth: "",
        address1: "",
        address2: "",
        city: "",
        pincode: "",
        state: "",
        country: "",
        contactNumber: "",
      });

      await profile.save();

      // Create a new user
      user = new userModel({
        name,
        email,
        password: hashedUid, // Store hashed uid as password
        accountType: "Buyer", // Default account type
        approved: true,
        profilePic: profilePic,
        additionalDetails: profile._id,
      });

      await user.save();

      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.TOKEN_SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User registered and logged in successfully with Google`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Google authentication failed. Please try again.",
    });
  }
};
