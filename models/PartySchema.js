const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  invites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invite",
    },
  ],
});

module.exports = mongoose.model("Party", partySchema);
