const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {MongoServerSelectionError} = require ('mongodb')

// Utility function to sign JWT token
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Sign up a new user
exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // console.log({name, email, password})

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Generate token and respond
    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      token,
      data: { user },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Sign up failed", error });
  }
};

// Login an existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({email, password})

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password); // comparePassword method from User model
    if (!isMatch) {
      console.log("nomatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate token and respond
    const token = signToken(user._id);
    const { password: pswd, ...userWithoutPassword } = user.toObject(); // Exclude password from response
    res.status(200).json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error, "inside login");
    if (error.name === "MongoServerSelectionError") {
      return res.status(503).json({ message: "Service Unavailable" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    if (error instanceof MongoServerSelectionError) {
      return res.status(503).json({ message: 'Service Unavailable' });
    }
  

    if (error.name === "MongooseError") {
      res.status(404).json({ success: false, message: "Database error!" });
    }
    res.status(500).json({ success: false, message: "Login failed!", error });
  }
};

// Logout the user (optional if using token-based auth)
exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Get logged-in user's data
exports.getMe = (req, res) => {
  const { user } = req; // req.user is set by the authMiddleware
  res.status(200).json({
    success: true,
    user,
  });
};
