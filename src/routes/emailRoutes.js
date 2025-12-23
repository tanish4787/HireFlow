import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  sendResumeToRecruiter,
  sendResumeBatch,
} from "../controllers/emailControllers.js";

const router = express.Router();

router.use(protect);

router.post("/send", sendResumeToRecruiter);
router.post("/send-batch", sendResumeBatch);

export default router;
