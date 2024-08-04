const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pushToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
