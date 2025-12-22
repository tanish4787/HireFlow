import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    cloudProvider: {
      type: String,
      required: true,
    },

    cloudFileId: {
      type: String,
      required: true,
    },

    fileSizeInBytes: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

ResumeSchema.index({ userId: 1, label: 1 }, { unique: true });

const Resume = mongoose.model("Resume", ResumeSchema);
export default Resume;
