import mongoose from "mongoose";

const EmailTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String, 
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true }
);

EmailTemplateSchema.index({ userId: 1, role: 1 }, { unique: true });

const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema);
export default EmailTemplate;
