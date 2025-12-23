import Resume from "../models/Resume.model.js";
import asyncHandler from "../utils/asyncErrorHandler.js";
import ApiError from "../utils/ApiError.js";
import { uploadFile, deleteFile } from "../utils/CloudStorageService.js";

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError("Resume file is required", 400);
  }

  const { label } = req.body;
  if (!label) {
    throw new ApiError("Resume label is required", 400);
  }

  const cloudResult = await uploadFile({
    buffer: req.file.buffer,
    fileName: req.file.originalname, 
  });

  try {
    const resume = await Resume.create({
      userId: req.user._id,
      label,
      fileUrl: cloudResult.url,
      cloudProvider: cloudResult.provider,
      cloudFileId: cloudResult.fileId,
      fileSizeInBytes: req.file.size,
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      data: resume,
    });
  } catch (error) {
    await deleteFile({ fileId: cloudResult.fileId });

    if (error.code === 11000) {
      throw new ApiError("Resume with this label already exists", 409);
    }

    throw new ApiError("Failed to save resume", 500);
  }
});

export const listResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: resumes.length,
    data: resumes,
  });
});

export const deleteResume = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;

  const resume = await Resume.findOne({
    _id: resumeId,
    userId: req.user._id,
  });

  if (!resume) {
    throw new ApiError("Resume not found", 404);
  }

  await deleteFile({ fileId: resume.cloudFileId });
  await resume.deleteOne();

  res.status(200).json({
    success: true,
    message: "Resume deleted successfully",
  });
});
