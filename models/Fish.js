const mongoose = require("mongoose");

const fishSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Fish", fishSchema); // Post is the collection in the db
