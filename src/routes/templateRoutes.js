import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  createTemplate,
  getTemplates,
  deleteTemplate,
} from "../controllers/templateControllers.js";

const router = express.Router();

router.use(protect);

router.post("/", createTemplate);
router.get("/", getTemplates);
router.delete("/:id", deleteTemplate);

export default router;
