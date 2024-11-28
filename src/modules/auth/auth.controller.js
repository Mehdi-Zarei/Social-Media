const { userRegisterValidatorSchema } = require("./auth.validator");
// const registerValidator = require("../auth/auth.validator");
const userModel = require("../../../models/user");

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

    const isUserExist = await userModel.findOne({ email, userName });

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
      //biography,
      //profilePicture,
      isPrivate: false,
      isVerified: false,
    });

    return successResponse(res, 201, {
      message: "New User Created Successfully.",
      user: { newUser, password: undefined },
    });
  } catch (error) {
    // next();
    console.log(error);
    return res.status(500).json(error);
  }
};
