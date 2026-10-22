
import mongoose from "mongoose";
import Resource from "../models/Resource.js";
import { getGridFSBucket } from "../config/gridfs.js";

// ==================================================
// CREATE RESOURCE
// ==================================================

export const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      subject,
      year,
      semester,
    } = req.body;

    // Validate required fields
    if (!title?.trim() || !type || !subject) {
      return res.status(400).json({
        success: false,
        message: "Title, type and subject are required.",
      });
    }

    if (!["notes", "question-paper", "study-material"].includes(type)) {
      return res.status(400).json({
        success: false,
        message:
          "Type must be notes, question-paper, or study-material.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(subject)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required.",
      });
    }

    const bucket = getGridFSBucket();

    // Upload PDF to GridFS
    const uploadStream = bucket.openUploadStream(
      req.file.originalname,
      {
        metadata: {
          contentType: req.file.mimetype || "application/pdf",
        },
      }
    );

    await new Promise((resolve, reject) => {
      uploadStream.once("finish", resolve);
      uploadStream.once("error", reject);
      uploadStream.end(req.file.buffer);
    });

    // Save resource details in MongoDB
    const resource = await Resource.create({
      title: title.trim(),
      description: description?.trim() || "",
      type,
      subject,
      fileId: uploadStream.id,
      fileUrl: `/api/resources/file/${uploadStream.id}`,
      fileName: req.file.originalname,
      year: year ? Number(year) : undefined,
      semester: semester ? Number(semester) : undefined,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Resource added successfully.",
      resource,
    });
  } catch (error) {
    console.error("Create resource error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create resource.",
    });
  }
};

// ==================================================
// GET ALL RESOURCES
// ==================================================

export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find({ isActive: true })
      .populate("subject", "name code")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    console.error("Get all resources error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resources.",
    });
  }
};

// ==================================================
// GET RESOURCES BY SUBJECT
// ==================================================

export const getResourcesBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID.",
      });
    }

    const resources = await Resource.find({
      subject: subjectId,
      isActive: true,
    })
      .populate("subject", "name code")
      .sort({
        type: 1,
        year: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    console.error("Get resources by subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subject resources.",
    });
  }
};

// ==================================================
// GET SINGLE RESOURCE
// ==================================================

export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID.",
      });
    }

    const resource = await Resource.findById(id)
      .populate("subject", "name code");

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    return res.status(200).json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error("Get resource error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resource.",
    });
  }
};

// ==================================================
// VIEW OR DOWNLOAD FILE FROM GRIDFS
// ==================================================

export const getResourceFile = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate GridFS file ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID.",
      });
    }

    const fileId = new mongoose.Types.ObjectId(id);
    const bucket = getGridFSBucket();

    // Find file in GridFS
    const file = await bucket.find({ _id: fileId }).next();

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    // ?download=true forces a download
    const isDownload = req.query.download === "true";

    // Use the stored content type
    const contentType =
      file.metadata?.contentType || "application/pdf";

    res.setHeader("Content-Type", contentType);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, no-cache");

    // Sanitize filename for the response header
    const originalName = String(file.filename || "resource.pdf")
      .replace(/[\r\n"]/g, "_");

    const fallbackName = originalName
      .replace(/[^\x20-\x7E]/g, "_")
      .replace(/[\\/]/g, "_") || "resource.pdf";

    const encodedName = encodeURIComponent(originalName);

    if (isDownload) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fallbackName}"; filename*=UTF-8''${encodedName}`
      );
    } else {
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${fallbackName}"; filename*=UTF-8''${encodedName}`
      );
    }

    // Stream PDF from GridFS
    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on("error", (error) => {
      console.error("GridFS download stream error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Unable to read file.",
        });
      } else {
        res.destroy(error);
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Get resource file error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Server error while retrieving file.",
      });
    }
  }
};

// ==================================================
// DELETE RESOURCE
// ==================================================

export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID.",
      });
    }

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    // Delete the GridFS file, if one is linked
    if (resource.fileId) {
      try {
        const bucket = getGridFSBucket();
        const fileId = new mongoose.Types.ObjectId(
          resource.fileId
        );

        await bucket.delete(fileId);

        console.log("GridFS file deleted:", resource.fileId);
      } catch (fileError) {
        // A missing GridFS file should not prevent resource deletion
        console.error("GridFS file delete error:", fileError);
      }
    }

    await Resource.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully.",
    });
  } catch (error) {
    console.error("Delete resource error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete resource.",
    });
  }
};
