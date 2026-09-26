import mongoose from "mongoose";
import Resource from "../models/Resource.js";
import { getGridFSBucket } from "../config/gridfs.js";


// ==================================================
// CREATE RESOURCE
// ==================================================

export const createResource = async (req, res) => {
  try {
    console.log("========== CREATE RESOURCE ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("=====================================");

    const {
      title,
      description,
      type,
      subject,
      year,
      semester,
    } = req.body;

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (!title || !type || !subject) {
      return res.status(400).json({
        success: false,
        message: "Title, type and subject are required.",
      });
    }

    if (!["notes", "question-paper"].includes(type)) {
      return res.status(400).json({
        success: false,
        message:
          "Type must be either notes or question-paper.",
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

    // ----------------------------------------------
    // GET GRIDFS BUCKET
    // ----------------------------------------------

    const bucket = getGridFSBucket();

    // ----------------------------------------------
    // UPLOAD FILE TO GRIDFS
    // ----------------------------------------------

    const uploadStream = bucket.openUploadStream(
      req.file.originalname,
      {
        metadata: {
          contentType:
            req.file.mimetype || "application/pdf",
        },
      }
    );

    uploadStream.end(req.file.buffer);

    // ----------------------------------------------
    // WAIT FOR GRIDFS UPLOAD
    // ----------------------------------------------

    uploadStream.on("error", (error) => {
      console.error(
        "GridFS upload error:",
        error
      );
    });

    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
    });

    // ----------------------------------------------
    // CREATE RESOURCE RECORD
    // ----------------------------------------------

    const resource = await Resource.create({
      title: title.trim(),

      description:
        description?.trim() || "",

      type,

      subject,

      fileId: uploadStream.id,

      fileUrl:
        `/api/resources/file/${uploadStream.id}`,

      fileName: req.file.originalname,

      year: year
        ? Number(year)
        : undefined,

      semester: semester
        ? Number(semester)
        : undefined,

      isActive: true,
    });

    // ----------------------------------------------
    // RESPONSE
    // ----------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Resource added successfully.",

      resource,
    });

  } catch (error) {
    console.error(
      "Create resource error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create resource.",
    });
  }
};


// ==================================================
// GET ALL RESOURCES
// ==================================================

export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find({
      isActive: true,
    })
      .populate("subject", "name code")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      resources,
    });

  } catch (error) {
    console.error(
      "Get all resources error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch resources.",
    });
  }
};


// ==================================================
// GET RESOURCES BY SUBJECT
// ==================================================

export const getResourcesBySubject = async (
  req,
  res
) => {
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
    console.error(
      "Get resources by subject error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch subject resources.",
    });
  }
};


// ==================================================
// GET SINGLE RESOURCE
// ==================================================

export const getResourceById = async (
  req,
  res
) => {
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
    console.error(
      "Get resource error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch resource.",
    });
  }
};


// ==================================================
// GET FILE FROM GRIDFS
// ==================================================

export const getResourceFile = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ----------------------------------------------
    // VALIDATE FILE ID
    // ----------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID.",
      });
    }

    const fileId = new mongoose.Types.ObjectId(id);

    // ----------------------------------------------
    // GET GRIDFS BUCKET
    // ----------------------------------------------

    const bucket = getGridFSBucket();

    // ----------------------------------------------
    // FIND FILE
    // ----------------------------------------------

    const file = await bucket
      .find({
        _id: fileId,
      })
      .next();

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    // ----------------------------------------------
    // CHECK DOWNLOAD REQUEST
    // ----------------------------------------------

    const isDownload =
      req.query.download === "true";

    // ----------------------------------------------
    // CONTENT TYPE
    // ----------------------------------------------

    res.setHeader(
      "Content-Type",
      file.metadata?.contentType ||
        "application/pdf"
    );

    // ----------------------------------------------
    // SAFE FILE NAME
    // ----------------------------------------------

    const safeFileName = String(
      file.filename || "resource.pdf"
    ).replace(/"/g, '\\"');

    // ----------------------------------------------
    // VIEW OR DOWNLOAD
    // ----------------------------------------------

    if (isDownload) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${safeFileName}"`
      );
    } else {
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${safeFileName}"`
      );
    }

    // ----------------------------------------------
    // STREAM FILE
    // ----------------------------------------------

    const downloadStream =
      bucket.openDownloadStream(fileId);

    downloadStream.on("error", (error) => {
      console.error(
        "GridFS download stream error:",
        error
      );

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Unable to read file.",
        });
      }
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error(
      "Get resource file error:",
      error
    );

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message:
          "Server error while retrieving file.",
      });
    }
  }
};


// ==================================================
// DELETE RESOURCE
// ==================================================

export const deleteResource = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID.",
      });
    }

    const resource =
      await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    // ----------------------------------------------
    // DELETE GRIDFS FILE
    // ----------------------------------------------

    if (resource.fileId) {
      try {
        const bucket = getGridFSBucket();

        await bucket.delete(
          new mongoose.Types.ObjectId(
            resource.fileId
          )
        );

        console.log(
          "GridFS file deleted:",
          resource.fileId
        );

      } catch (fileError) {
        console.error(
          "GridFS file delete error:",
          fileError
        );
      }
    }

    // ----------------------------------------------
    // DELETE RESOURCE DOCUMENT
    // ----------------------------------------------

    await Resource.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Resource deleted successfully.",
    });

  } catch (error) {
    console.error(
      "Delete resource error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete resource.",
    });
  }
};