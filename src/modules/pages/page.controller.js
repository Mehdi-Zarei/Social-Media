const { default: mongoose } = require("mongoose");
const userModel = require("../../../models/user");
const followModel = require("../../../models/follow");
const postModel = require("../../../models/post");
const likeModel = require("../../../models/like");
const hasAccessToPage = require("../../utils/hasAccessToUserPage");

exports.showUserPage = async (req, res, next) => {
  try {
    const { pageID } = req.params;
    const userID = req.user._id;

    if (!mongoose.isValidObjectId(pageID)) {
      return res.status(400).json({ message: "Page ID Not Valid !!" });
    }

    const isPageExist = await userModel.findOne({ _id: pageID });

    if (!isPageExist) {
      return res.status(404).json({ message: "User Page Not Found !!" });
    }

    const followerCount = await followModel
      .find({ following: pageID })
      .countDocuments();

    const followingCount = await followModel
      .find({ follower: pageID })
      .countDocuments();

    const doesItHavAccess = await hasAccessToPage(userID, pageID);

    const IsItFollowed = await followModel.findOne({
      follower: userID._id,
      following: pageID,
    });

    if (!doesItHavAccess) {
      return res.status(403).json({
        message: "Follow Page To Show Content !!",
        isThisPageFollowed: Boolean(IsItFollowed),
        followerCount,
        followingCount,
      });
    }
    const userPageInfo = await userModel
      .findOne({ _id: pageID })
      .select("name userName biography isVerified")
      .lean();

    const userPost = await postModel
      .find({ user: pageID })
      .sort({ createdAt: -1 })
      .lean();

    // Find the posts liked by the current user
    const likedPosts = await likeModel
      .find({
        user: userID,
        post: {
          $in: userPost.map(
            (userPost) => new mongoose.Types.ObjectId(userPost._id)
          ),
        },
      })
      .select("post")
      .lean();

    // Create a Set of liked post IDs to quickly check if a post has been liked by the user
    const likedPostIDs = new Set(
      likedPosts.map((like) => like.post.toString()) // Map through the likedPosts array and extract the post IDs, converting them to strings
    );

    // Add like information to each post to indicate whether the current user has liked it
    const postsWithLikeInfo = userPost.map((post) => ({
      ...post,
      isLikedByUser: likedPostIDs.has(post._id.toString()), // Check if the post has been liked by the user by looking it up in the likedPostIDs Set
    }));

    return res.status(200).json({
      message: "User Can See Page Content.",
      isThisPageFollowed: Boolean(IsItFollowed),
      followerCount,
      followingCount,
      userPageInfo,
      userPost: postsWithLikeInfo,
      pageOwner: userID.toString() === pageID,
    });
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

exports.showUserFollowers = async (req, res, next) => {
  try {
    const userID = req.user;
    const { pageID } = req.params;

    if (!mongoose.isValidObjectId(pageID)) {
      return res.status(400).json({ message: "Page ID Not Valid !!" });
    }

    const isPageExist = await userModel.findOne({ _id: pageID });

    if (!isPageExist) {
      return res.status(404).json({ message: "Page Not Found  !!" });
    }

    const IsItFollowed = await followModel.findOne({
      follower: userID._id,
      following: pageID,
    });

    if (!Boolean(IsItFollowed) && isPageExist.isPrivate === true) {
      return res.status(401).json({
        message:
          "It is not possible to view the list of followers of personal pages before following them.",
      });
    }

    const userFollowers = await followModel
      .find({ following: pageID })
      .select("follower")
      .populate("follower", "name userName");

    const formattedFollowers = userFollowers.map((follow) => follow.follower);

    if (userFollowers.length === 0) {
      return res
        .status(404)
        .json({ message: "This user has no followers yet." });
    }

    return res.status(200).json({ userFollowers: formattedFollowers });
  } catch (error) {
    next(error);
  }
};

exports.showUserFollowings = async (req, res, next) => {
  try {
    const userID = req.user;
    const { pageID } = req.params;

    if (!mongoose.isValidObjectId(pageID)) {
      return res.status(400).json({ message: "Page ID Not Valid !!" });
    }

    const isPageExist = await userModel.findOne({ _id: pageID });

    if (!isPageExist) {
      return res.status(404).json({ message: "Page Not Found  !!" });
    }

    const IsItFollowed = await followModel.findOne({
      follower: userID._id,
      following: pageID,
    });

    if (!Boolean(IsItFollowed) && isPageExist.isPrivate === true) {
      return res.status(401).json({
        message:
          "It is not possible to view the list of followings of personal pages before following them.",
      });
    }
    const userFollowings = await followModel
      .find({ follower: pageID })
      .select("following")
      .populate("following", "name userName");

    const formattedFollowings = userFollowings.map(
      (follow) => follow.following
    );

    if (userFollowings.length === 0) {
      return res
        .status(404)
        .json({ message: "This user has not followed anyone yet." });
    }

    return res.status(200).json({ userFollowings: formattedFollowings });
  } catch (error) {
    next(error);
  }
};
