import Resource from "../models/Resource.js";
import fs from "fs";
import path from "path";

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
        message:
          "Title, type and subject are required",
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

    const resource = await Resource.create({
      title: title.trim(),

      description:
        description?.trim() || "",

      type,

      subject,

      fileUrl:
        `/uploads/${req.file.filename}`,

      fileName:
        req.file.originalname,

      year:
        year ? Number(year) : undefined,

      semester:
        semester ? Number(semester) : undefined,

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

export async function getAllResources(req, res) {
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
    const { subjectId } = req.params;

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "Subject ID is required",
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
    const { id } = req.params;

    const resource =
      await Resource.findById(id)
        .populate(
          "subject",
          "name code"
        );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
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
// DELETE RESOURCE
// ============================================

export async function deleteResource(
  req,
  res
) {
  try {
    const { id } = req.params;

    const resource =
      await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // Delete physical file
    if (resource.fileUrl) {
      const filename =
        path.basename(resource.fileUrl);

      const filePath =
        path.join(
          process.cwd(),
          "uploads",
          filename
        );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Resource.findByIdAndDelete(id);

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