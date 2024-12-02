const express = require("express");
const router = express.Router();
// const { createUploader } = require("./uploader");
const pageController = require("./page.controller");
const authMiddleware = require("../../middlewares/auth");

//// Configure the uploader for profile pictures
// const profileUploader = createUploader(
//   "./public/uploads/profile",
//   /jpeg|jpg|png|webp/,
//   5 * 1024 * 1024 // 5 MB max file size
// );

// // Route for uploading profile picture
// router.post(
//   "/upload-profile",
//   profileUploader.single("profile"),
//   (req, res) => {
//     // Access the uploaded file through req.file
//     res.json({
//       message: "Profile uploaded successfully!",
//       file: req.file, // Details of the uploaded file
//     });
//   }
// );

router.route("/:pageID").get(authMiddleware, pageController.showUserPage);

router
  .route("/:pageID/follow")
  .post(authMiddleware, pageController.followUsers);

router
  .route("/:pageID/unFollow")
  .post(authMiddleware, pageController.unFollowUsers);

router
  .route("/:pageID/followers")
  .get(authMiddleware, pageController.showUserFollowers);

module.exports = router;
