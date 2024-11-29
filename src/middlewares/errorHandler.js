module.exports.errorHandler = (err, req, res, next) => {
  // If there is a validation error or other specific errors
  if (err.errors) {
    console.log(err.errors);
    return res.status(400).json({
      status: "error",
      message: err.errors[0],
    });
  }

  // If an unexpected error occurs
  if (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "An unknown error occurred",
    });
  }

  next();
};
