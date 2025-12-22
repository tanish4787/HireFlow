import mongoose from "mongoose";

const MagicTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

MagicTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const MagicToken = mongoose.model("MagicToken", MagicTokenSchema);
export default MagicToken;
