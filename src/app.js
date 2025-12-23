import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoutes from "./routes/authRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/templates", templateRoutes);

app.use(errorMiddleware);

export default app;
