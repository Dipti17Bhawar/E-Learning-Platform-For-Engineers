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
      enum: [
        "notes",
        "question-paper",
      ],
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
    },

    semester: {
      type: Number,
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