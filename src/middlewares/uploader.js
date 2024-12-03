const multer = require("multer");
const fs = require("fs");
const path = require("path");

/**
 * Create an uploader for storing files with customizable configurations
 * @param {string} baseDestination - Base directory where files will be stored
 * @param {RegExp} allowedTypes - Regular expression defining allowed file types
 * @param {number} maxFileSize - Maximum allowed file size in bytes
 * @param {function} dynamicDestination - Function to determine the subdirectory dynamically
 * @returns {multer} - A configured multer uploader
 */
const createUploader = (
  baseDestination,
  allowedTypes = /jpeg|jpg|png|webp|mp4|avi|mkv/,
  maxFileSize = 10 * 1024 * 1024,
  dynamicDestination = null
) => {
  // Ensure the base destination directory exists
  if (!fs.existsSync(baseDestination)) {
    fs.mkdirSync(baseDestination, { recursive: true });
  }

  // Define the storage configuration
  const storage = multer.diskStorage({
    // Dynamically determine the destination subdirectory
    destination: function (req, file, cb) {
      const subDir =
        typeof dynamicDestination === "function"
          ? dynamicDestination(file)
          : "profile"; // Default to "others" if no function is provided
      const finalDestination = path.join(baseDestination, subDir);

      // Ensure the subdirectory exists
      if (!fs.existsSync(finalDestination)) {
        fs.mkdirSync(finalDestination, { recursive: true });
      }

      cb(null, finalDestination);
    },
    // Generate a unique filename
    filename: function (req, file, cb) {
      const uniqueName = Date.now() * Math.floor(Math.random() * 1e9); // Generate a unique timestamp-based identifier
      const ext = path.extname(file.originalname); // Extract the file extension
      cb(null, `${uniqueName}${ext}`); // Combine unique name with the file extension
    },
  });

  // Filter files based on their MIME types
  const fileFilter = (req, file, cb) => {
    if (allowedTypes.test(file.mimetype)) {
      cb(null, true); // Accept the file if the MIME type matches the allowed types
    } else {
      cb(new Error("File type not allowed!")); // Reject the file if the MIME type is not allowed
    }
  };

  // Create and return the uploader
  return multer({
    storage,
    limits: {
      fileSize: maxFileSize, // Set the maximum file size
    },
    fileFilter,
  });
};

// Export the uploader function
module.exports = { createUploader };
