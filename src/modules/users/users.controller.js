const fs = require("fs");
const path = require("path");
const userModel = require("../../../models/user");

exports.getUserProfileInfo = async (req, res, next) => {
  try {
    const user = req.user._id;
    const userData = await userModel.findById(user);

    return res.status(200).json({
      name: userData.name,
      userName: userData.userName,
      email: userData.email,
      biography: userData.biography,
      profilePicture: userData.profilePicture,
      isPrivate: userData.isPrivate,
      isVerified: userData.isVerified,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserProfileInfo = async (req, res, next) => {
  try {
    const user = req.user._id;

    const { name, userName, email, password, biography, isPrivate } = req.body;

    const userData = await userModel.findById(user);

    // Check if each field has changed and update
    if (name) userData.name = name;

    if (userName) userData.userName = userName;

    if (email) userData.email = email;

    if (biography) userData.biography = biography;

    if (password) userData.password = password;

    if (isPrivate !== undefined) userData.isPrivate = isPrivate;

    //Save new user info
    await userData.save();

    return res.status(200).json({
      message: "User profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserProfilePicture = async (req, res, next) => {
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
