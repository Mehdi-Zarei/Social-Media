const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    biography: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});
const model = mongoose.model("User", schema);

module.exports = model;
