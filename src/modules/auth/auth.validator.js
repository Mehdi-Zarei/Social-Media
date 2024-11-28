const yup = require("yup");

// Define a validation schema for user fields
exports.userRegisterValidatorSchema = yup.object().shape({
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

// const Validator = require("fastest-validator");

// // Create a new Validator instance
// const v = new Validator();

// // Define the validation schema
// const schema = {
//   name: {
//     type: "string", // Must be a string
//     min: 2, // Minimum length
//     max: 50, // Maximum length
//     empty: false, // Cannot be empty
//     messages: {
//       required: "Name is required.",
//       stringMin: "Name must be at least 2 characters long.",
//       stringMax: "Name cannot exceed 50 characters.",
//     },
//   },
//   userName: {
//     type: "string", // Must be a string
//     min: 3, // Minimum length
//     max: 30, // Maximum length
//     pattern: /^[a-zA-Z0-9_]+$/, // Regex to allow only letters, numbers, and underscores
//     empty: false, // Cannot be empty
//     messages: {
//       required: "Username is required.",
//       stringMin: "Username must be at least 3 characters long.",
//       stringMax: "Username cannot exceed 30 characters.",
//       stringPattern:
//         "Username can only contain letters, numbers, and underscores (_).",
//     },
//   },
//   email: {
//     type: "email", // Must be a valid email
//     empty: false, // Cannot be empty
//     messages: {
//       required: "Email is required.",
//       email: "Invalid email format.",
//     },
//   },
//   password: {
//     type: "string", // Must be a string
//     min: 8, // Minimum length
//     pattern:
//       /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/, // Strong password requirements
//     empty: false, // Cannot be empty
//     messages: {
//       required: "Password is required.",
//       stringMin: "Password must be at least 8 characters long.",
//       stringPattern:
//         "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
//     },
//   },
// };

// // Compile the schema
// const check = v.compile(schema);

// module.exports = check;
