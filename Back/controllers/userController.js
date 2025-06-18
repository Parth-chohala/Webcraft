import bcryptjs from "bcryptjs";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
// const User = require("../models/user.model.js");

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.find({ $or: [{ name }, { email }] });
    if (existingUser.length > 0) {
      // console.log("User already exists:", existingUser);
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    // Save user to database
    await newUser.save();
    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    // Send response
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Only works over HTTPS
        sameSite: "strict", // Optional: Helps prevent CSRF
      })
      .status(201)
      .json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        token,
      });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.find({ email });
    if (user.length === 0) {
      // console.log("Invalid email or password:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user[0].password);
    if (!isPasswordValid) {
      // console.log("Invalid email or password for user:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    // Send response
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
      })
      .status(200)
      .json({
        message: "User logged in successfully",
        user: {
          id: user[0]._id,
          name: user[0].name,
          email: user[0].email,
        },
        token,
      });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getUser = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Send user data
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateUser = async (req, res) => {
  const userId = req.user.id;
  const { name, email, password } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcryptjs.hash(password, 10);
    // Save updated user
    await user.save();
    // Send response
    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteUser = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find user by ID and delete
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Send response
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = (req, res) => {
  try {
    // Clear the cookie
    res
      .cookie("token", "", {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        expires: new Date(0), // Expire the cookie immediately
      })
      .status(200)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const findforuser = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log("Email :", email);
    const result = await User.findOne({ email: email });

    if (!result) {
      return res.status(404).json({ flag: false });
    }

    return res.status(200).json({ flag: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ flag: false });
  }
};

