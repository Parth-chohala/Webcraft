const mongoose = require("mongoose");
const { Schema } = mongoose;


const transferschema = new Schema(
  {
    projectId: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: false,
      default: null, //1 accepted 0 declined null not changed just initialized 
    },
  },
  {
    timestamps: true,
  }
);

const TransferRequest = mongoose.model("transferRequests", transferschema);
module.exports = TransferRequest;
