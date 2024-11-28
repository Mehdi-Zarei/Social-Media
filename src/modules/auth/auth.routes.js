const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

router.route("/register").post(authController.register);

module.exports = router;
