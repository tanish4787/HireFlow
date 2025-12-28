import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ApiError from "../utils/ApiError.js";

import User from "../models/User.model.js";
import MagicToken from "../models/MagicToken.model.js";

import generateMagicToken from "../utils/generateMagicToken.js";
import { sendEmail } from "../utils/EmailService.js";

import crypto from "crypto";
import jwt from "jsonwebtoken";

export const loginWithMagicLink = asyncErrorHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError("Email is required", 400);
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email });
  }

  const recentTokensCount = await MagicToken.countDocuments({
    userId: user._id,
    createdAt: { $gt: new Date(Date.now() - 15 * 60 * 1000) },
  });

  if (recentTokensCount >= 3) {
    return res.status(200).json({
      success: true,
      message: "If the email exists, a magic link has been sent.",
    });
  }

  const { rawToken, tokenHash } = generateMagicToken();

  await MagicToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const magicLink = `${process.env.CLIENT_URL}/auth/verify?token=${rawToken}`;

  await sendEmail({
    to: email,
    subject: "Your HireFlow login link",
    text: `Hi,

Click the link below to log in to HireFlow:

${magicLink}

This link will expire in 10 minutes.

– HireFlow`,
    html: `
      <p>Hi,</p>
      <p>Click the link below to log in to <strong>HireFlow</strong>:</p>
      <p><a href="${magicLink}">${magicLink}</a></p>
      <p>This link will expire in 10 minutes.</p>
      <p>– HireFlow</p>
    `,
  });

  res.status(200).json({
    success: true,
    message: "Magic link sent to your email",
  });
});

export const verifyMagicLink = asyncErrorHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new ApiError("Invalid or missing token", 400);
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const magicToken = await MagicToken.findOne({
    tokenHash,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!magicToken) {
    throw new ApiError("Token expired or already used", 401);
  }

  magicToken.used = true;
  await magicToken.save();

  const jwtToken = jwt.sign(
    { userId: magicToken.userId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    success: true,
    token: jwtToken,
  });
});
