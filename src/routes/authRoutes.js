import express from "express";
import {
  loginWithMagicLink,
  verifyMagicLink,
} from "../controllers/authContollers.js";

const router = express.Router();

router.post("/login", loginWithMagicLink);
router.get("/verify", verifyMagicLink);

export default router;
