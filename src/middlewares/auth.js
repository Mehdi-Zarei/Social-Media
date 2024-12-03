const userModel = require("../../models/user");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies["access-token"];
    if (!token) {
      return res.status(401).json({
        message: "Pleas Register Or Login First.",
      });
    }

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!payload) {
      return res.status(401).json({
        message: "Pleas Register Or Login First And Try To Upload New Posts !!",
      });
    }

    const user = await userModel.findOne({ _id: payload._id }).lean();

    if (!user) {
      return res.status(401).json({
        message: "Pleas Register Or Login First And Try To Upload New Posts !!",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
