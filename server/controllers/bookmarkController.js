
import mongoose from "mongoose";
import User from "../models/User.js";
import Resource from "../models/Resource.js";

// GET BOOKMARKS
export async function getBookmarks(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .populate("bookmarks");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch bookmarks.",
    });
  }
}

// ADD BOOKMARK
export async function addBookmark(req, res) {
  try {
    const { resourceId } = req.params;

    if (!mongoose.isValidObjectId(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID.",
      });
    }

    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const exists = user.bookmarks.some(
      (id) => id.toString() === resourceId
    );

    if (!exists) {
      user.bookmarks.push(resource._id);
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: exists
        ? "Resource is already bookmarked."
        : "Resource bookmarked successfully.",
    });
  } catch (error) {
    console.error("Add bookmark error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to bookmark resource.",
    });
  }
}

// REMOVE BOOKMARK
export async function removeBookmark(req, res) {
  try {
    const { resourceId } = req.params;

    if (!mongoose.isValidObjectId(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { bookmarks: new mongoose.Types.ObjectId(resourceId) } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bookmark removed successfully.",
    });
  } catch (error) {
    console.error("Remove bookmark error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to remove bookmark.",
    });
  }
}
