const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  password: {
    type: String,
    required: false,
  },
  name: { type: String, required: false },
  email: {
    type: String,
    required: false,
    lowercase: true,
  },
  createdAt: {
    immutable: true, // you can't update this property
    type: Date,
    default: () => new Date(),
  },
});

module.exports = mongoose.model("Post", postSchema); // Post is the collection in the db
