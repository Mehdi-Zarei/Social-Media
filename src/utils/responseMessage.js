//* Helper function to success response format
exports.successResponse = (res, statusCode = 200, data) => {
  return res
    .status(statusCode)
    .json({ status: statusCode, success: true, data });
};

//* Helper function to error response format

exports.errorResponse = (res, statusCode, message, data) => {
  console.log(message, data); //Log error details...

  return res
    .status(statusCode)
    .json({ status: statusCode, success: false, error: message, data });
};

module.exports = { successResponse, errorResponse };
