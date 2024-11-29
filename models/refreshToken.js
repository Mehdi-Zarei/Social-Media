const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expireIn: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

schema.statics.createRefreshToken = async (user) => {
  const expireInDays = +process.env.REFRESH_TOKEN_EXPIRE;
  const millisecondsInADay = 24 * 60 * 60 * 1000;
  const refreshToken = uuidv4();
  const refreshTokenDocument = new model({
    user: user._id,
    token: refreshToken,
    expireIn: new Date(Date.now() + expireInDays * millisecondsInADay),
  });

  refreshTokenDocument.save();

  return refreshToken;
};

schema.statics.verifyRefreshToken = async (token) => {
  const refreshTokenDocument = await model.findOne({ token });

  if (refreshTokenDocument && refreshTokenDocument.expireIn >= Date.now()) {
    return refreshTokenDocument.user;
  } else {
    return null;
  }
};

const model = mongoose.model("RefreshToken", schema);

module.exports = model;
