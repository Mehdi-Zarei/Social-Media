const userModel = require("../../../models/user");

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
