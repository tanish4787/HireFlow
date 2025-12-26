import Recruiter from "../models/Recruiter.model.js";
import asyncHandler from "../utils/asyncErrorHandler.js";
import ApiError from "../utils/ApiError.js";

export const createRecruiter = asyncHandler(async (req, res) => {
  const { name, email, company, role } = req.body;

  if (!email || !name || !company || !role) {
    throw new ApiError("All fields are required", 400);
  }

  const recruiter = await Recruiter.create({
    userId: req.user._id,
    name,
    email,
    company,
    role,
  });

  res.status(201).json({
    success: true,
    data: recruiter,
  });
});

export const getRecruiters = asyncHandler(async (req, res) => {
  const recruiters = await Recruiter.find({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: recruiters,
  });
});
