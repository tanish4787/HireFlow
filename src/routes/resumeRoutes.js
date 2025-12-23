import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  uploadResume,
  listResumes,
  deleteResume,
} from "../controllers/resumeControllers.js";
import uploadResumeMiddleware from "../middlewares/multer.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", uploadResumeMiddleware.single("resume"), uploadResume);
router.get("/", listResumes);
router.delete("/:resumeId", deleteResume);

export default router;
