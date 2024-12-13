const yup = require("yup");

// Define a validation schema for user fields
module.exports.userRegisterValidatorSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required.") // Field is mandatory
    .min(2, "Name must be at least 2 characters long.") // Minimum length
    .max(50, "Name cannot exceed 50 characters."), // Maximum length

  userName: yup
    .string()
    .required("Username is required.") // Field is mandatory
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores (_)."
    ) // Regex to enforce valid characters
    .min(3, "Username must be at least 3 characters long.") // Minimum length
    .max(30, "Username cannot exceed 30 characters."), // Maximum length

  email: yup
    .string()
    .required("Email is required.") // Field is mandatory
    .email("Invalid email format."), // Must follow valid email format

  password: yup
    .string()
    .required("Password is required.") // Field is mandatory
    .min(8, "Password must be at least 8 characters long.") // Minimum length
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
    ), // Regex to enforce strong password rules
});

module.exports.userLoginValidatorSchema = yup.object().shape({
  identifier: yup
    .string()
    .min(3, "Username or email  must be at least 3 characters long.")
    .max(50, "username or email should not exceed 50 characters")
    .required("username or email is required"),
  password: yup
    .string()
    .required("Password is required.") // Mandatory field
    .min(8, "Password must be at least 8 characters long.") // Minimum length
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
    ), // Strong password rules
});

module.exports.resetPasswordValidatorSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required.") // Field is mandatory
    .email("Invalid email format."), // Must follow valid email format
});

module.exports.forgetPasswordValidatorSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required.") // Mandatory field
    .min(8, "Password must be at least 8 characters long.") // Minimum length
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  token: yup.string().required("Reset Password Token Is Required."),
});
