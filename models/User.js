const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },
  email: {
    minLength: 6,
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  isVerifaied: { type: Boolean, default: false },
  createdAt: {
    immutable: true, // you can't update this property
    type: Date,
    default: () => new Date(),
  },
  roles: [
    {
      type: String,
      default: "parents",
    },
  ],
  updatesAt: Date,
  son:[{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Studenst'
  }]
});

module.exports = mongoose.model("User", userSchema); // User is the collection in the db
