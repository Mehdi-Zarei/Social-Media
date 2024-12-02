const postsModel = require("../../../models/post");
const userModel = require("../../../models/user");

exports.createNewPost = async (req, res, next) => {
  try {
    //Authentication from middleware auth
    const user = req.user;

    const isUserAccountVerified = await userModel
      .findOne({
        $and: [{ _id: user._id }, { isVerified: true }],
      })
      .lean();

    if (!isUserAccountVerified) {
      return res.status(401).json({ message: "Please verify your account." });
    }

    const { description, hashtags } = req.body;
    const tags = hashtags.split(",");

    // Ensure the file exists in the request

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    // Check file type (photo or video)

    let mediaUrlPath;

    // If the file is an image

    if (req.file.mimetype.startsWith("image")) {
      mediaUrlPath = `public/uploads/posts/images/${req.file.filename}`;
    }
    // If the file is an video
    else if (req.file.mimetype.startsWith("video")) {
      mediaUrlPath = `public/uploads/posts/videos/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    const newPost = await postsModel.create({
      media: {
        filename: req.file.filename,
        path: mediaUrlPath,
      },
      description,
      hashtags: tags,
      user: user._id,
    });

    return res.status(201).json({ message: "New Post Created Successfully." });
  } catch (error) {
    next(error);
  }
};
