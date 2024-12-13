const {
  userRegisterValidatorSchema,
  userLoginValidatorSchema,
  resetPasswordValidatorSchema,
  forgetPasswordValidatorSchema,
} = require("./auth.validator");

const {
  errorResponse,
  successResponse,
} = require("../../utils/responseMessage");

const userModel = require("../../../models/user");
const refreshTokenModel = require("../../../models/refreshToken");
const resetPasswordModel = require("../../../models/resetPassword");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.register = async (req, res, next) => {
  try {
    const { name, userName, email, password } = req.body;

    await userRegisterValidatorSchema.validate(
      { name, userName, email, password },
      { abortEarly: false }
    );

    const isUserExist = await userModel.findOne({
      $or: [{ email }, { userName }],
    });

    if (isUserExist) {
      return errorResponse(res, 400, "Email or user name is already exist !!");
    }

    const usersCount = await userModel.countDocuments();

    const newUser = await userModel.create({
      name,
      userName,
      email,
      password,
      role: usersCount > 0 ? "USER" : "ADMIN",
    });

    // TODO: Token expire in need be change!
    const accessToken = await jwt.sign(
      { _id: newUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60d" }
    );

    const refreshToken = await refreshTokenModel.createRefreshToken(newUser);

    res.cookie("access-token", accessToken, {
      maxAge: 900_000,
      httpOnly: true,
      secure: true,
    });

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      maxAge: 900_000,
      secure: true,
    });

    return successResponse(res, 201, {
      message: "New User Created Successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    await userLoginValidatorSchema.validate({ identifier, password });

    const user = await userModel.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user) {
      return errorResponse(res, 409, "User Not Found !!");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      errorResponse(res, 409, "Password not Valid !!");
    }
    // TODO: Token expire in need be change!

    const accessToken = await jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60d" }
    );

    const refreshToken = await refreshTokenModel.createRefreshToken(user);

    res.cookie("access-token", accessToken, {
      maxAge: 900_000,
      httpOnly: true,
      // secure: true,
    });

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      maxAge: 900_000,
      // secure: true,
    });

    return successResponse(res, 200, "User Login successfully.");
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const userID = await RefreshTokenModel.verifyToken(refreshToken);
    if (!userID) {
      return errorResponse(res, 409, "User ID Not Found !!");
    }

    await RefreshTokenModel.findOneAndDelete({ token: refreshToken });

    const user = await UserModel.findOne({ _id: userID });
    if (!user) {
      return errorResponse(res, 409, "User Not Found !!");
    }

    const accessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30day",
    });

    const newRefreshToken = await RefreshTokenModel.createToken(user);

    res.cookie("access-token", accessToken, {
      maxAge: 900_000,
      httpOnly: true,
    });

    res.cookie("refresh-token", newRefreshToken, {
      maxAge: 900_000,
      httpOnly: true,
    });

    return successResponse(res, 200, "refresh token set successfully.");
  } catch (err) {
    next(err);
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    await resetPasswordValidatorSchema.validate(
      { email },
      { abortEarly: true }
    );

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User Not Found!!" });
    }

    const restPasswordToken = crypto.randomBytes(16).toString("hex");

    const restPasswordTokenExpireTime = Date.now() + 1000 * 60 * 60; // 1 Hour

    await resetPasswordModel.create({
      user: user._id,
      token: restPasswordToken,
      tokenExpireTime: restPasswordTokenExpireTime,
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.nodemailerEmailAccount,
        pass: process.env.nodemailerPasswordAccount,
      },
    });

    const mailOptions = {
      from: process.env.nodemailerEmailAccount,
      to: email,
      subject: "Reset Password Link",
      html: `
      <h2>Hi,${user.name}</h2>
      <a href=http://localhost:${process.env.PORT}/auth/reset-password/${restPasswordToken}>Reset Password<a/>`,
    };

    transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: `Reset password link sended successfully to ${email}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    const { token } = req.params;

    await forgetPasswordValidatorSchema.validate(
      { token, password },
      { abortEarly: true }
    );

    const resetPassword = await resetPasswordModel.findOne({
      token,
      tokenExpireTime: { $gt: Date.now() },
    });

    if (!resetPassword) {
      return res
        .status(404)
        .json({ message: "User not found or link expired." });
    }

    const user = await userModel.findOne({ _id: resetPassword.user });

    if (!user) {
      return res.status(404).json({ message: "User not found !!" });
    }

    user.password = password;
    await user.save();

    await resetPasswordModel.findOneAndDelete({ _id: resetPassword._id });

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
};
