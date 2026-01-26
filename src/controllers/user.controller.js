const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { username, email, ph_no, address, password, con_password } = req.body;

    // Validate required fields
    if (!username || !email || !ph_no || !address || !password || !con_password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if passwords match
    if (password !== con_password) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      ph_no,
      address,
      password
    });

    return res.status(201).json({
      message: "User registered successfully.",
      user: { id: user._id, username: user.username, email: user.email},
    });
    
  } catch (err) {
    console.error("Error during user registration:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if email and password are provided
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }
  
      // Find user by email
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: "User does not exist." });
      }
  
      // Validate password
      const isPasswordValid = await user.isPasswordCorrect(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid user credentials." });
      }
  
      // Generate access token
      const accessToken = user.generateAccessToken();
  
      // Send response with the access token
      return res.status(200).json({
        message: "Login successful.",
        accessToken
      });
      
    } catch (err) {
      console.error("Error during user login:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
};

const checkUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];         

        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        return res.status(200).json({ user: decoded });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
module.exports = { registerUser,loginUser,checkUser };
