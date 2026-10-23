
import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from bookmarking the same resource twice.
bookmarkSchema.index(
  { user: 1, resource: 1 },
  { unique: true }
);

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
