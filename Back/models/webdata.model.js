const mongoose = require('mongoose');
const { Schema } = mongoose;

const webDataSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
   thumbnail: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true, // Optional field
    default: '', // Optional field with a default value
  },
  dataString: {
    type: String,
  },
 user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});
const WebData = mongoose.model('WebData', webDataSchema);
module.exports = WebData;