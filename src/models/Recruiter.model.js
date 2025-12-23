import mongoose from "mongoose";

const RecruiterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

RecruiterSchema.index({ userId: 1, email: 1 }, { unique: true });

const Recruiter = mongoose.model("Recruiter", RecruiterSchema);
export default Recruiter;
