import WebData from "../models/webdata.model.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/mailer.js";
import TransferRequest from "../models/transferRequest.model.js";
import User from "../models/user.model.js";
// import { Mongoose } from "mongoose";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const initiateTransfer = async (req, res) => {
  const { id } = req.params;
  const { reciever } = req.body;

//   console.log("data ", reciever, id);

  const project = await WebData.findOne({ _id: id });
  if (!project) return res.status(404).json({ message: "Project not found" });

  const recieverdata = await User.findOne({ email: reciever });
//   console.log("Reciever : ", recieverdata);
  if (!recieverdata)
    return res.status(404).json({ message: "recipient not found" });

  const transferData = new TransferRequest({
    projectId: id,
    owner: req.user._id,
    recipient: recieverdata._id,
  });

  await transferData.save();

  const token = await jwt.sign(
    {
      id: transferData._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );

  try {
    const result = await sendEmail({
      to: reciever,
      project,
      user: req.user,
      token,
    });
    // console.log("Email data", result);/
    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send email", error });
  }
};

const validatetransfer = async (req, res) => {
  const { token } = req.params;
  try {
    const valid = await jwt.verify(token, process.env.JWT_SECRET);
    const result = await TransferRequest.findById(valid?.id);
    return res.status(200).json({ result });
  } catch (err) {
    // console.log("Error in validating....", err);
    return res.status(500).json({ message: "error " });
  }
};

const AcceptOrRejectTransfer = async (req, res) => {
  const { flag } = req.params;
  const { token } = req.body;
  try {
    const valid = await jwt.verify(token, process.env.JWT_SECRET);

    const tranasferRequestData = await TransferRequest.findByIdAndUpdate(
      valid?.id,
      {
        status: flag,
      }
    );

    if (flag == true) {
      const ownerdata = await User.findById(tranasferRequestData.owner);
      if (!ownerdata) {
        // console.log("owner not found");
        return res.status(500).json({ message: "Owner not found " });
      }
      const result = await WebData.findByIdAndUpdate(
        tranasferRequestData?.projectId,
        {
          user_id: new ObjectId(tranasferRequestData.recipient),
          tranferedfrom: ownerdata.email,
        }
      );
      if (!result) {
        // console.log("webdata not found");
        return res.status(500).json({ message: "Project not found " });
      }
      //   console.log("transfer data :",ownerdata,result);
      return res.status(200).json({ result });
    } else {
      return res.status(200).json({ tranasferRequestData });
    }
  } catch (err) {
    // console.log("Error in validating....", err);
    return res.status(500).json({ message: "error " });
  }
};
export default {
  validatetransfer,
  initiateTransfer,
  AcceptOrRejectTransfer,
};
