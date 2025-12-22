import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  createRecruiter,
  getRecruiters,
} from "../controllers/recruiterControllers.js";

const router = express.Router();

router.use(protect);

router.post("/", createRecruiter);
router.get("/", getRecruiters);

export default router;
