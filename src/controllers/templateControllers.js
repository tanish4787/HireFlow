import Template from "../models/EmailTemplate.model.js";
import asyncHandler from "../utils/asyncErrorHandler.js";
import ApiError from "../utils/ApiError.js";

export const createTemplate = asyncHandler(async (req, res) => {
  const { role, subject, body } = req.body;

  if (!role || !subject || !body) {
    throw new ApiError("role, subject and body are required", 400);
  }

  const template = await Template.create({
    userId: req.user._id,
    role,
    subject,
    body,
  });

  res.status(201).json({
    success: true,
    data: template,
  });
});

export const getTemplates = asyncHandler(async (req, res) => {
  const templates = await Template.find({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: templates.length,
    data: templates,
  });
});

export const deleteTemplate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const template = await Template.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  });

  if (!template) {
    throw new ApiError("Template not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Template deleted successfully",
  });
});
