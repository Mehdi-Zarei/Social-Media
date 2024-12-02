const userModel = require("../../models/user");
const followModel = require("../../models/follow");

module.exports = async (userID, pageID) => {
  try {
    if (userID === pageID) {
      return true;
    }

    // console.log("userID==>", userID, "PageID==>", pageID);

    const page = await userModel.findOne({ _id: pageID });
    // console.log("page=>", page);
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
