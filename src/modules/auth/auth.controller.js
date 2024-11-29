// const registerValidator = require("../auth/auth.validator");
const { userRegisterValidatorSchema } = require("./auth.validator");
const userModel = require("../../../models/user");
const refreshTokenModel = require("../../../models/refreshToken");
const jwt = require("jsonwebtoken");

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
