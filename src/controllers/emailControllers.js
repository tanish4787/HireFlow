import asyncHandler from "../utils/asyncErrorHandler.js";
import ApiError from "../utils/ApiError.js";

import Resume from "../models/Resume.model.js";
import Recruiter from "../models/Recruiter.model.js";
import SendLog from "../models/SendLog.model.js";
import EmailTemplate from "../models/EmailTemplate.model.js";

import { sendEmail } from "../utils/EmailService.js";
import { renderTemplate } from "../utils/RenderTemplate.js";

export const sendResumeToRecruiter = asyncHandler(async (req, res) => {
  const { recruiterId, resumeId } = req.body;

  if (!recruiterId || !resumeId) {
    throw new ApiError("recruiterId and resumeId are required", 400);
  }

  const recruiter = await Recruiter.findOne({
    _id: recruiterId,
    userId: req.user._id,
  });

  if (!recruiter) {
    throw new ApiError("Recruiter not found", 404);
  }

  const resume = await Resume.findOne({
    _id: resumeId,
    userId: req.user._id,
  });

  if (!resume) {
    throw new ApiError("Resume not found", 404);
  }

  const alreadySent = await SendLog.findOne({
    userId: req.user._id,
    resumeId,
    recruiterId,
  });

  if (alreadySent) {
    throw new ApiError("Resume already sent to this recruiter", 409);
  }

  const template = await EmailTemplate.findOne({
    userId: req.user._id,
    role: recruiter.role,
  });

  const subject = template?.subject || "Job Application";

  const emailText = template
    ? renderTemplate(template.body, {
        recruiterName: recruiter.name || "there",
        company: recruiter.company || "your organization",
        role: recruiter.role || "the open position",
        senderName: req.user.name || "Candidate",
      })
    : `Hi ${recruiter.name || "there"},

I came across an opportunity that aligns well with my background and wanted to reach out.

I’ve attached my resume for your review.  
If the position is open, I’d be happy to discuss further.

Regards,  
${req.user.name || "Candidate"}`;

  await sendEmail({
    to: recruiter.email,
    subject,
    text: emailText,
    attachments: [
      {
        filename: `${resume.label}.pdf`,
        path: resume.fileUrl,
      },
    ],
  });

  await SendLog.create({
    userId: req.user._id,
    resumeId,
    recruiterId,
  });

  res.status(200).json({
    success: true,
    message: "Resume sent successfully",
  });
});

export const sendResumeBatch = asyncHandler(async (req, res) => {
  const { resumeId, recruiterIds } = req.body;

  if (!resumeId || !Array.isArray(recruiterIds) || recruiterIds.length === 0) {
    throw new ApiError("resumeId and recruiterIds are required", 400);
  }

  if (recruiterIds.length > 5) {
    throw new ApiError("Maximum 5 recruiters allowed per batch", 400);
  }

  const resume = await Resume.findOne({
    _id: resumeId,
    userId: req.user._id,
  });

  if (!resume) {
    throw new ApiError("Resume not found", 404);
  }

  const recruiters = await Recruiter.find({
    _id: { $in: recruiterIds },
    userId: req.user._id,
  });

  if (recruiters.length === 0) {
    throw new ApiError("No valid recruiters found", 404);
  }

  const results = [];

  for (const recruiter of recruiters) {
    const alreadySent = await SendLog.findOne({
      userId: req.user._id,
      resumeId,
      recruiterId: recruiter._id,
    });

    if (alreadySent) {
      results.push({
        recruiterId: recruiter._id,
        email: recruiter.email,
        status: "SKIPPED",
        reason: "Already contacted",
      });
      continue;
    }

    try {
      const template = await EmailTemplate.findOne({
        userId: req.user._id,
        role: recruiter.role,
      });

      const subject = template?.subject || "Job Application ";

      const emailText = template
        ? renderTemplate(template.body, {
            recruiterName: recruiter.name || "there",
            company: recruiter.company || "your organization",
            role: recruiter.role || "the open position",
            senderName: req.user.name || "Candidate",
          })
        : `Hi ${recruiter.name || "there"},

I wanted to reach out regarding an opportunity that aligns well with my profile.

I’ve attached my resume for your reference.  
Looking forward to connecting.

Regards,  
${req.user.name || "Candidate"}`;

      await sendEmail({
        to: recruiter.email,
        subject,
        text: emailText,
        attachments: [
          {
            filename: `${resume.label}.pdf`,
            path: resume.fileUrl,
          },
        ],
      });

      await SendLog.create({
        userId: req.user._id,
        resumeId,
        recruiterId: recruiter._id,
      });

      results.push({
        recruiterId: recruiter._id,
        email: recruiter.email,
        status: "SENT",
      });
    } catch (err) {
      results.push({
        recruiterId: recruiter._id,
        email: recruiter.email,
        status: "FAILED",
        error: err.message,
      });
    }
  }

  res.status(200).json({
    success: true,
    summary: {
      total: recruiters.length,
      sent: results.filter((r) => r.status === "SENT").length,
      skipped: results.filter((r) => r.status === "SKIPPED").length,
      failed: results.filter((r) => r.status === "FAILED").length,
    },
    results,
  });
});
