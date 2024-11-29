const mongoose = require("mongoose");
const { ref } = require("yup");

const schema = new mongoose.Schema(
  {
    media: {
      path: { type: String, required: true },
      filename: { type: String, required: true },
      required: true,
    },
    description: {
      type: String,
    },
    hashtags: { type: [String] },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Post", schema);

module.exports = model;