const express = require("express");
const router = express.Router();

const pageController = require("./page.controller");
const authMiddleware = require("../../middlewares/auth");

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

router
  .route("/:pageID/followings")
  .get(authMiddleware, pageController.showUserFollowings);

module.exports = router;
