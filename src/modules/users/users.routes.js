const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth");
const userController = require("./users.controller");

const { createUploader } = require("../../middlewares/uploader");

// Configure the uploader for profile pictures
const profileUploader = createUploader(
  "./public/uploads/profile",
  /jpeg|jpg|png|webp/,
  5 * 1024 * 1024 // 5 MB max file size
);

// Route for uploading profile picture
router
  .route("/edit-profile")
  .put(
    authMiddleware,
    profileUploader.single("profile"),
    userController.updateUserProfile
  );

module.exports = router;
