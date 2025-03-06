// Library
const multer = require("multer");

const path = require("path");

// Define the Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile"); // Uploads will be stored in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    const fileName = `${req.res.locals.id}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

const uploadProfile = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb("Not Allow This File Type", false);
    }
  },
});

module.exports = uploadProfile;
