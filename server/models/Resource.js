import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "notes",
        "question-paper",
        "study-material",
      ],
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    fileUrl: {
      type: String,
      default: "",
    },

    fileName: {
      type: String,
      default: "",
    },

    year: {
      type: String,
      default: "",
    },

    semester: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Resource",
  resourceSchema
);