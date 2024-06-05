const mongoose = require("mongoose");

// Define the applicationSchema first
const applicationSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
  postingLink: {
    type: String,
  },
  status: {
    type: String,
    enum: ["interested", "applied", "interviewing", "rejected", "accepted"],
  },
});

// Define the userSchema and embed applicationSchema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  applications: [applicationSchema],
});

// Create models
const User = mongoose.model("User", userSchema);

module.exports = User;
