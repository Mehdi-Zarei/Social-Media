const postsModel = require("../../../models/post");

exports.createNewPost = async (req, res, next) => {
  try {
    const { description, hashtags } = req.body;
    const tags = hashtags.split(",");

    // اطمینان از وجود فایل در درخواست
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const user = req.user; // فرض می‌شود که user از middleware احراز هویت به درخواست اضافه شده است

    // بررسی نوع فایل (عکس یا ویدیو)
    let mediaUrlPath;

    // اگر فایل تصویر باشد
    if (req.file.mimetype.startsWith("image")) {
      mediaUrlPath = `public/uploads/posts/images/${req.file.filename}`;
    }
    // اگر فایل ویدیو باشد
    else if (req.file.mimetype.startsWith("video")) {
      mediaUrlPath = `public/uploads/posts/videos/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // ایجاد پست جدید با داده‌های دریافت‌شده
    const newPost = await postsModel.create({
      media: {
        filename: req.file.filename,
        path: mediaUrlPath,
      },
      description,
      hashtags: tags,
      user: user._id, // شناسه کاربر از اطلاعات احراز هویت
    });

    return res.status(201).json({ message: "New Post Created Successfully." });
  } catch (error) {
    next(error); // مدیریت خطا
  }
};
