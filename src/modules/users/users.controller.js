const userModel = require("../../../models/user");

const fs = require("fs");
const path = require("path");

exports.updateUserProfile = async (req, res, next) => {
  try {
    const userID = req.user._id;

    if (!req.file || !req.file.filename) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profilePath = `public/uploads/profile/${req.file.filename}`;

    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user.profilePicture);
    // Delete old profile picture if it exists.
    if (user.profilePicture) {
      const oldProfilePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        user.profilePicture
      ); // path old profile picture
      if (fs.existsSync(oldProfilePath)) {
        fs.unlinkSync(oldProfilePath); //Delete old profile picture
      }
    }

    // Update profile picture
    user.profilePicture = profilePath;
    await user.save();

    return res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    next(error);
  }
};
