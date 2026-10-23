
import mongoose from "mongoose";
import Bookmark from "../models/Bookmark.js";
import Resource from "../models/Resource.js";

// GET /api/bookmarks
// Return the logged-in user's saved resources.
export const getBookmarks = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please log in to view bookmarks.",
      });
    }

    const savedBookmarks = await Bookmark.find({
      user: userId,
    })
      .populate("resource")
      .sort({ createdAt: -1 })
      .lean();

    // Return resource objects directly for the frontend.
    const bookmarks = savedBookmarks
      .map((item) => item.resource)
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      bookmarks,
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch bookmarks.",
    });
  }
};

// POST /api/bookmarks/:resourceId
// Save a resource for the logged-in user.
export const addBookmark = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { resourceId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please log in to bookmark resources.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
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

    // Return success if it is already bookmarked.
    const existingBookmark = await Bookmark.findOne({
      user: userId,
      resource: resourceId,
    });

    if (existingBookmark) {
      return res.status(200).json({
        success: true,
        message: "Resource is already bookmarked.",
        bookmark: resource,
      });
    }

    await Bookmark.create({
      user: userId,
      resource: resourceId,
    });

    return res.status(201).json({
      success: true,
      message: "Resource bookmarked successfully.",
      bookmark: resource,
    });
  } catch (error) {
    // Handle a duplicate-key race condition.
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "Resource is already bookmarked.",
      });
    }

    console.error("Add bookmark error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to bookmark this resource.",
    });
  }
};

// DELETE /api/bookmarks/:resourceId
// Remove a resource from the logged-in user's bookmarks.
export const removeBookmark = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { resourceId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please log in to manage bookmarks.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID.",
      });
    }

    const deletedBookmark = await Bookmark.findOneAndDelete({
      user: userId,
      resource: resourceId,
    });

    if (!deletedBookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found.",
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
};
