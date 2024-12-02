const { default: mongoose } = require("mongoose");
const userModel = require("../../../models/user");
const followModel = require("../../../models/follow");
const hasAccessToPage = require("../../utils/hasAccessToUserPage");

exports.showUserPage = async (req, res, next) => {
  try {
    const { pageID } = req.params;
    const userID = req.user;

    const hasAccess = await hasAccessToPage(userID, pageID);

    if (!hasAccess) {
      return res
        .status(403)
        .json({ message: "Follow Page To Show Content !!" });
    }
    return res.status(200).json({ message: "User Can See Page Content." });
  } catch (error) {
    next(error);
  }
};

exports.followUsers = async (req, res, next) => {
  try {
    const user = req.user;
    const { pageID } = req.params;

    if (!mongoose.isValidObjectId(pageID)) {
      return res.status(400).json({ message: "Page ID Not Valid !!" });
    }

    const isPageExist = await userModel.findOne({ _id: pageID });

    if (!isPageExist) {
      return res.status(404).json({ message: "User Page Not Found !!" });
    }

    if (isPageExist.equals(user._id)) {
      return res.status(400).json({ message: "You Can't Follow Yourself!!" });
    }

    const hasFollowed = await followModel.findOne({
      follower: user._id,
      following: pageID,
    });

    if (hasFollowed) {
      return res
        .status(409)
        .json({ message: "You are already following this page !!" });
    }

    const followUser = await followModel.create({
      follower: user._id,
      following: pageID,
    });

    return res
      .status(201)
      .json({ message: "You are following this page successfully." });
  } catch (error) {
    next(error);
  }
};

exports.unFollowUsers = async (req, res, next) => {
  try {
    const user = req.user;
    const { pageID } = req.params;

    if (!mongoose.isValidObjectId(pageID)) {
      return res.status(400).json({ message: "Page ID Not Valid !!" });
    }

    const isPageExist = await userModel.findOne({ _id: pageID });

    if (!isPageExist) {
      return res.status(404).json({ message: "Page Not Found  !!" });
    }

    if (isPageExist.equals(user._id)) {
      return res.status(409).json({ message: "You Can't UnFollow Yourself!!" });
    }

    const hasFollowed = await followModel.findOne({
      follower: user._id,
      following: pageID,
    });

    if (!hasFollowed) {
      return res
        .status(409)
        .json({ message: "This page is not among your followers." });
    }

    const unFollow = await followModel.findOneAndDelete({
      follower: user._id,
      following: pageID,
    });

    return res
      .status(200)
      .json({ message: "You have successfully unfollowed this page." });
  } catch (error) {
    next(error);
  }
};
