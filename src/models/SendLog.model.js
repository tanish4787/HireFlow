import mongoose from "mongoose";

const SendLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

SendLogSchema.index(
  { userId: 1, resumeId: 1, recruiterId: 1 },
  { unique: true }
);

const SendLog = mongoose.model("SendLog", SendLogSchema);
export default SendLog;
