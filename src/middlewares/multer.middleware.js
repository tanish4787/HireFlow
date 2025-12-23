import multer from "multer";
import ApiError from "../utils/ApiError.js";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    cb(new ApiError("Only PDFs are allowed.", 400));
  } else {
    cb(null, true);
  }
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export default uploadResume;
