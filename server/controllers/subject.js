import Subject from "../models/Subject.js";
import Branch from "../models/Branch.js";


// =====================================================
// ADD SUBJECT
// POST /api/subjects
// =====================================================

export async function createSubject(req, res) {
  try {
    const {
      name,
      code,
      description,
      branch,
      semester,
    } = req.body;

    if (!name || !branch) {
      return res.status(400).json({
        success: false,
        message: "Subject name and branch are required",
      });
    }

    // Check branch exists
    const existingBranch = await Branch.findById(branch);

    if (!existingBranch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    // Check duplicate subject
    const existingSubject = await Subject.findOne({
      name: name.trim(),
      branch,
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: "Subject already exists in this branch",
      });
    }

    const subject = await Subject.create({
      name,
      code,
      description,
      branch,
      semester,
    });

    return res.status(201).json({
      success: true,
      message: "Subject added successfully",
      subject,
    });

  } catch (error) {
    console.error("Create subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add subject",
    });
  }
}


// =====================================================
// GET ALL SUBJECTS
// GET /api/subjects
// =====================================================

export async function getSubjects(req, res) {
  try {
    const subjects = await Subject.find({
      isActive: true,
    })
      .populate("branch", "name code")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      subjects,
    });

  } catch (error) {
    console.error("Get subjects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
    });
  }
}


// =====================================================
// GET SUBJECTS BY BRANCH
// GET /api/subjects/branch/:branchId
// =====================================================

export async function getSubjectsByBranch(req, res) {
  try {
    const { branchId } = req.params;

    const branch = await Branch.findById(branchId);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    const subjects = await Subject.find({
      branch: branchId,
      isActive: true,
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      branch,
      subjects,
    });

  } catch (error) {
    console.error("Get branch subjects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch branch subjects",
    });
  }
}


// =====================================================
// GET SINGLE SUBJECT
// GET /api/subjects/:id
// =====================================================

export async function getSubject(req, res) {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id)
      .populate("branch", "name code");

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      subject,
    });

  } catch (error) {
    console.error("Get subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subject",
    });
  }
}


// =====================================================
// DELETE SUBJECT
// DELETE /api/subjects/:id
// =====================================================

export async function deleteSubject(req, res) {
  try {
    const { id } = req.params;

    const subject = await Subject.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });

  } catch (error) {
    console.error("Delete subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete subject",
    });
  }
}