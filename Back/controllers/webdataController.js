import WebData from "../models/webdata.model.js";
import { ObjectId } from "mongoose";
import Mongoose from "mongoose";
import sendEmail from "../utils/mailer.js";
import jwt from "jsonwebtoken";
// const ObjectId = require("mongoose").Types.ObjectId;

export const getWebData = async (req, res) => {
  const id = new Mongoose.Types.ObjectId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "Web data not found" });
  }
  try {
    // Find the web data by project ID
    const webData = await WebData.findOne({ _id: id });
    if (!webData) {
      return res.status(404).json({ message: "Web data not found" });
    }
    // Send the web data
    res.status(200).json(webData);
  } catch (error) {
    console.error("Error fetching web data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getWebDataForDashboard = async (req, res) => {
  const id = req.user.id;

  if (!id) {
    return res.status(400).json({ message: "Web data not found" });
  }

  try {
    // Exclude the 'dataString' field
    const webData = await WebData.find({ user_id: id }).select("-dataString");

    if (!webData) {
      return res.status(404).json({ message: "Web data not found" });
    }

    res.status(200).json(webData);
  } catch (error) {
    console.error("Error fetching web data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllWebData = async (req, res) => {
  const id = req.user.id;

  try {
    // Fetch all web data
    const allWebData = await WebData.find({ user_id: id });
    if (!allWebData || allWebData.length === 0) {
      return res.status(404).json({ message: "No web data found" });
    }
    // console.log("All web data fetched successfully:", allWebData);
    // Send the web data
    res.status(200).json(allWebData);
  } catch (error) {
    console.error("Error fetching all web data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const addnewWebData = async (req, res) => {
  const { title, description, thumbnail, dataString } = req.body;
  const userId = req.user.id;

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  try {
    // Create new web data
    const newWebData = new WebData({
      title,
      thumbnail: imageUrl, // Use the URL of the uploaded image
      description,
      dataString,
      user_id: userId,
    });
    // lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    await newWebData.save();
    // Send success response
    res
      .status(201)
      .json({ message: "Web data created successfully", webData: newWebData });
  } catch (error) {
    console.error("Error creating web data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateWebData = async (req, res) => {
  const { description, title, thumbnail, dataString } = req.body;
  // Ensure id is a valid ObjectId
  const id = new Mongoose.Types.ObjectId(req.params.id);
  try {
    // Find the web data by ID
    const webData = await WebData.findById(id);
    if (!webData) {
      return res.status(404).json({ message: "Web data not found" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file?.filename
    }`;

    // Update the web data fields
    // console.log('title',title);
    // console.log('description',description);
    // console.log('thumbnail',thumbnail);

    webData.title = title || webData.title;
    webData.thumbnail = req.file ? imageUrl : webData.thumbnail;
    webData.dataString = dataString || webData.dataString;
    webData.description = description || webData.description;
    // Save the updated web data
    await webData.save();
    // Send success response
    res.status(200).json({ message: "Web data updated successfully", webData });
  } catch (error) {
    console.error("Error updating web data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const duplicateWebdata = async (req, res) => {
  const id = new Mongoose.Types.ObjectId(req.params.id);
  const title = req.body?.title;
  // console.log("TItle ",req.body)
  try {
    // Find the web data by ID
    const webData = await WebData.findById(id);
    if (!webData) {
      return res.status(404).json({ message: "Web data not found" });
    }
    webData.title = title ? title : webData.title;
    // Update the web data fields
    const dupWebdata = new WebData({
      title: title,
      description: webData.description,
      dataString: webData.dataString,
      thumbnail: webData.thumbnail,
      user_id: webData.user_id,
    });
    // Save the updated web data
    await dupWebdata.save();
    // Send success response
    res
      .status(201)
      .json({ message: "Web data Duplicated successfully", dupWebdata });
  } catch (error) {
    console.error("Error Duplicating web data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteWebData = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the web data by project ID
    const result = await WebData.deleteOne(new Mongoose.Types.ObjectId(id));
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Web data not found" });
    }
    // Send success response
    res.status(200).json({ message: "Web data deleted successfully" });
  } catch (error) {
    console.error("Error deleting web data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

