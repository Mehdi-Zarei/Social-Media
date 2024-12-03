const express = require("express");
const router = express.Router();
const { createUploader } = require("../../middlewares/uploader");
const postController = require("./posts.controller");
const authMiddleware = require("../../middlewares/auth");

// Dynamic destination for posts (images and videos)
const postDynamicDestination = (file) => {
  if (/image/.test(file.mimetype)) return "images";
  if (/video/.test(file.mimetype)) return "videos";
  return "others";
};

// Configure the uploader for posts
const postUploader = createUploader(
  "./public/uploads/posts",
  /jpeg|jpg|png|webp|mp4|avi|mkv/,
  20 * 1024 * 1024, // 20 MB max file size
  postDynamicDestination
);

// Route for uploading posts

router
  .route("/")
  .post(
    authMiddleware,
    postUploader.single("media", 20),
    postController.createNewPost
  );

router
  .route("/:postID/reaction")
  .post(authMiddleware, postController.likeOrDislikePost);

module.exports = router;
