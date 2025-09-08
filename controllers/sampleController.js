const User = require("../models/sampleModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
  try {
    const { username, email, phoneNumber, city, address, password, confirmPassword } = req.body;

    // Check if user already exists by email or username only
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email is already registered." });
      }
  
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = new User({
      username,
      email,
      phoneNumber,
      city,
      address,
      password: hashedPassword,
      confirmPassword: hashedPassword // Store same hashed value for validation
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.status(201).json({
      message: "User created successfully!",
      token: token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        city: newUser.city,
        address: newUser.address
      },
    });
  } catch (error) {
    console.error("FULL SIGNUP ERROR:", error);
    console.error("Error Stack:", error.stack);

    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
     res.status(500).json({ 
      message: "Error creating user!",
      error: error.message});
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if both email and username are missing
    if (!email && !username) {
      return res.status(400).json({ message: "Email or username is required." });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    // Build search query based on what's provided
    let searchQuery = {};
    if (email && username) {
      // If both provided, search by either
      searchQuery = { 
        $or: [
          { email: email.trim() },
          { username: username.trim() }
        ] 
      };
    } else if (email) {
      // If only email provided
      searchQuery = { email: email.trim() };
    } else if (username) {
      // If only username provided
      searchQuery = { username: username.trim() };
    }

    console.log("Search query:", searchQuery); // Debug log

    const user = await User.findOne(searchQuery);
    
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.status(200).json({
      message: "Login successful!",
      token: token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email,
        phoneNumber: user.phoneNumber,
        city: user.city,
        address: user.address,
        profileImage: user.profileImage
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error logging in!" });
  }
};
module.exports = {
  signupUser,
  loginUser
};