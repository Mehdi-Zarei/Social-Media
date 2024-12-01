const express = require("express");
const router = express.Router();
const postController = require("./posts.controller");
const authMiddleware = require("../../middlewares/auth");

router.route("/").post(authMiddleware, postController.createNewPost);

module.exports = router;
