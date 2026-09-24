import Resource from "../models/Resource.js";
import Subject from "../models/Subject.js";

// ========================================
// ADD RESOURCE
// ========================================
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const allowedTypes = [
      "notes",
      "question-paper",
      "study-material",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message:
          "Type must be notes, question-paper or study-material",
      });
    }

    const existingSubject = await Subject.findById(subject);

    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const resource = await Resource.create({
      title,
      description: description || "",
      type,
      subject,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      year: year || "",
      semester: semester || "",
    });

    return res.status(201).json({
      success: true,
      message: "Resource uploaded successfully",
      resource,
    });
  } catch (error) {
    console.error("Create resource error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add resource",
      error: error.message,
    });
  }
};

// ========================================
// GET ALL RESOURCES
// ========================================
export async function getResources(req, res) {
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
    console.error("Get resources error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
      error: error.message,
    });
  }
}

// ========================================
// GET RESOURCES BY SUBJECT
// ========================================
export async function getResourcesBySubject(req, res) {
  try {
    const { subjectId } = req.params;

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "Subject ID is required",
      });
    }

    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const resources = await Resource.find({
      subject: subjectId,
      isActive: true,
    }).sort({
      type: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      subject,
      resources,
    });
  } catch (error) {
    console.error("Get resources by subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subject resources",
      error: error.message,
    });
  }
}

// ========================================
// GET SINGLE RESOURCE
// ========================================
export async function getResource(req, res) {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id)
      .populate("subject", "name code");

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
    console.error("Get resource error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resource",
      error: error.message,
    });
  }
}

// ========================================
// DELETE RESOURCE
// ========================================
export async function deleteResource(req, res) {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    await Resource.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Delete resource error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete resource",
      error: error.message,
    });
  }
}