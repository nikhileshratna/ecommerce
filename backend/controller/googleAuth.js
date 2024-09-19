const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.googleAuth = async (req, res) => {
  try {
    console.log("req body" , req.body);
    const { uid, name, email, profilePic } = req.body.userData;

    console.log("Received Google Auth request:", { uid, name, email, profilePic });

    // Ensure UID is present
    if (!uid || typeof uid !== 'string' || uid.length === 0) {
      console.error("Invalid UID:", uid);
      return res.status(400).json({
        success: false,
        message: "Invalid or missing UID for Google authentication.",
      });
    }

    // Check if user already exists
    let user = await userModel.findOne({ email });
    console.log("User lookup result:", user);

    if (user) {
      // User exists, log them in
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.TOKEN_SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );
      console.log("Generated token for existing user:", token);

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      console.log("Login successful for existing user:", user);
      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User logged in successfully with Google`,
      });
    } else {
      console.log("User does not exist, proceeding with registration");

      // Hash the uid to store as password
      const hashedUid = await bcrypt.hash(uid, 10);
      console.log("Hashed UID:", hashedUid);

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
      console.log("Profile created and saved:", profile);

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
      console.log("New user created and saved:", user);

      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.TOKEN_SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );
      console.log("Generated token for new user:", token);

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      console.log("Registration successful for new user:", user);
      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User registered and logged in successfully with Google`,
      });
    }
  } catch (error) {
    console.error("Error in Google Auth:", error);
    return res.status(500).json({
      success: false,
      message: "Google authentication failed. Please try again.",
    });
  }
};
