// const registerValidator = require("../auth/auth.validator");
const {
  userRegisterValidatorSchema,
  userLoginValidatorSchema,
} = require("./auth.validator");
const userModel = require("../../../models/user");
const refreshTokenModel = require("../../../models/refreshToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
  errorResponse,
  successResponse,
} = require("../../utils/responseMessage");

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
