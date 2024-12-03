const userModel = require("../../models/user");
const followModel = require("../../models/follow");

module.exports = async (userID, pageID) => {
  try {
    if (userID.toString() === pageID.toString()) {
      return true;
    }

    const page = await userModel.findOne({ _id: pageID });
    if (!page.isPrivate) {
      return true;
    }

    const follow = await followModel.findOne({
      follower: userID,
      following: pageID,
    });

    if (!follow) {
      return false;
    }

    return true;
  } catch (error) {
    console.log(error);
  }
};
