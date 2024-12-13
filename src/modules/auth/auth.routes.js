const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/refresh").post(authController.refreshToken);

router.route("/forget-password").post(authController.forgetPassword);
router.route("/reset-password/:token").post(authController.resetPassword);

module.exports = router;
