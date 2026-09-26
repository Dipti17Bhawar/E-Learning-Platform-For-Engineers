import Resource from "../models/Resource.js";
import mongoose from "mongoose";
import { Readable } from "stream";

import { getGridFSBucket } from "../config/gridfs.js";

// ============================================
// CREATE RESOURCE
// ============================================

export async function createResource(req, res) {
  try {
    const {
      title,
      description,
      type,
      subject,
      year,
      semester,
    } = req.body;

    if (!title || !type || !subject) {
      return res.status(400).json({
        success: false,
        message: "Title, type and subject are required",
      });
    }

    if (
      ![
        "notes",
        "question-paper",
        "study-material",
      ].includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Type must be notes, question-paper or study-material",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    // ============================================
    // UPLOAD PDF TO MONGODB GRIDFS
    // ============================================

    const bucket = getGridFSBucket();

    const fileId = await new Promise(
      (resolve, reject) => {
        const uploadStream =
          bucket.openUploadStream(
            req.file.originalname,
            {
              metadata: {
                contentType:
                  req.file.mimetype,
              },
            }
          );

        uploadStream.on(
          "finish",
          () => {
            resolve(uploadStream.id);
          }
        );

        uploadStream.on(
          "error",
          (error) => {
            reject(error);
          }
        );

        Readable.from(
          req.file.buffer
        ).pipe(uploadStream);
      }
    );

    console.log(
      "GridFS file uploaded:",
      fileId
    );

    // ============================================
    // CREATE RESOURCE DOCUMENT
    // ============================================

    const resource =
      await Resource.create({
        title: title.trim(),

        description:
          description?.trim() || "",

        type,

        subject,

        fileId,

        fileUrl:
          `/api/resources/file/${fileId}`,

        fileName:
          req.file.originalname,

        year:
          year
            ? Number(year)
            : undefined,

        semester:
          semester
            ? Number(semester)
            : undefined,

        isActive: true,
      });

    return res.status(201).json({
      success: true,

      message:
        "Resource added successfully",

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
        "Failed to create resource",
    });
  }
}


// ============================================
// GET ALL RESOURCES
// ============================================

export async function getAllResources(
  req,
  res
) {
  try {
    const resources =
      await Resource.find({
        isActive: true,
      })
        .populate(
          "subject",
          "name code"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      resources,
    });

  } catch (error) {
    console.error(
      "Get resources error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch resources",
    });
  }
}


// ============================================
// GET RESOURCES BY SUBJECT
// ============================================

export async function getResourcesBySubject(
  req,
  res
) {
  try {
    const { subjectId } =
      req.params;

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Subject ID is required",
      });
    }

    const resources =
      await Resource.find({
        subject: subjectId,
        isActive: true,
      })
        .populate(
          "subject",
          "name code"
        )
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
        "Failed to fetch subject resources",
    });
  }
}


// ============================================
// GET SINGLE RESOURCE
// ============================================

export async function getResourceById(
  req,
  res
) {
  try {
    const { id } =
      req.params;

    const resource =
      await Resource.findById(id)
        .populate(
          "subject",
          "name code"
        );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message:
          "Resource not found",
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
        "Failed to fetch resource",
    });
  }
}


// ============================================
// VIEW / DOWNLOAD PDF FROM GRIDFS
// ============================================

export async function getResourceFile(
  req,
  res
) {
  try {
    const { id } =
      req.params;

    // Validate ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid file ID",
      });
    }

    const fileId =
      new mongoose.Types.ObjectId(id);

    const bucket =
      getGridFSBucket();

    // Find file in GridFS
    const files =
      await bucket
        .find({
          _id: fileId,
        })
        .toArray();

    if (!files.length) {
      return res.status(404).json({
        success: false,
        message:
          "PDF file not found",
      });
    }

    const file = files[0];

    // PDF content type
    res.set(
      "Content-Type",
      "application/pdf"
    );

    // Open PDF in browser
    res.set(
      "Content-Disposition",
      `inline; filename="${file.filename}"`
    );

    // Stream file from GridFS
    const downloadStream =
      bucket.openDownloadStream(
        fileId
      );

    downloadStream.on(
      "error",
      (error) => {
        console.error(
          "GridFS download error:",
          error
        );

        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message:
              "Failed to load PDF",
          });
        }
      }
    );

    downloadStream.pipe(res);

  } catch (error) {
    console.error(
      "Get resource file error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load PDF",
    });
  }
}


// ============================================
// DELETE RESOURCE
// ============================================

export async function deleteResource(
  req,
  res
) {
  try {
    const { id } =
      req.params;

    const resource =
      await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message:
          "Resource not found",
      });
    }

    // ============================================
    // DELETE PDF FROM GRIDFS
    // ============================================

    if (resource.fileId) {
      try {
        const bucket =
          getGridFSBucket();

        const fileId =
          new mongoose.Types.ObjectId(
            resource.fileId
          );

        await bucket.delete(
          fileId
        );

        console.log(
          "GridFS file deleted:",
          fileId
        );

      } catch (gridfsError) {
        console.error(
          "GridFS delete error:",
          gridfsError
        );
      }
    }

    // ============================================
    // DELETE RESOURCE DOCUMENT
    // ============================================

    await Resource.findByIdAndDelete(
      id
    );

    return res.status(200).json({
      success: true,

      message:
        "Resource deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete resource error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete resource",
    });
  }
}