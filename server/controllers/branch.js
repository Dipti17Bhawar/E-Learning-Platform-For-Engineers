import Branch from "../models/Branch.js";
import Subject from "../models/Subject.js";


// =====================================================
// CREATE BRANCH
// POST /api/branches
// =====================================================

export async function createBranch(req, res) {
  try {
    const {
      name,
      code,
      description,
      image,
    } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Branch name and code are required",
      });
    }

    const branchCode = code.trim().toUpperCase();

    const existingBranch = await Branch.findOne({
      code: branchCode,
    });

    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: "Branch with this code already exists",
      });
    }

    const branch = await Branch.create({
      name: name.trim(),
      code: branchCode,
      description: description || "",
      image: image || "",
    });

    return res.status(201).json({
      success: true,
      message: "Branch created successfully",
      branch,
    });

  } catch (error) {
    console.error("Create branch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create branch",
    });
  }
}


// =====================================================
// GET ALL ACTIVE BRANCHES
// GET /api/branches
// =====================================================

export async function getBranches(req, res) {
  try {
    const branches = await Branch.find({
      isActive: true,
    }).sort({
      name: 1,
    });

    return res.status(200).json({
      success: true,
      branches,
    });

  } catch (error) {
    console.error("Get branches error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch branches",
    });
  }
}


// =====================================================
// GET BRANCH BY CODE + SUBJECTS
// GET /api/branches/code/:code
// =====================================================

export async function getBranchByCode(req, res) {
  try {

    const code = req.params.code
      ?.trim()
      .toUpperCase();

    console.log("Requested branch code:", code);

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Branch code is required",
      });
    }


    // Find branch
    const branch = await Branch.findOne({
      code,
      isActive: true,
    });

    console.log("Found branch:", branch);


    if (!branch) {
      return res.status(404).json({
        success: false,
        message: `Branch with code ${code} not found`,
      });
    }


    // Find subjects belonging to this branch
    const subjects = await Subject.find({
      branch: branch._id,
      isActive: true,
    }).sort({
      name: 1,
    });


    console.log(
      "Subjects found:",
      subjects.length
    );


    return res.status(200).json({
      success: true,

      branch: {
        _id: branch._id,
        name: branch.name,
        code: branch.code,
        description: branch.description,
        image: branch.image,
      },

      subjects,
    });

  } catch (error) {

    console.error(
      "Get branch by code error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch branch.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
}


// =====================================================
// GET SINGLE BRANCH BY ID
// GET /api/branches/:id
// =====================================================

export async function getBranch(req, res) {
  try {
    const branch = await Branch.findById(
      req.params.id
    );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    return res.status(200).json({
      success: true,
      branch,
    });

  } catch (error) {
    console.error("Get branch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch branch",
    });
  }
}


// =====================================================
// UPDATE BRANCH
// PUT /api/branches/:id
// =====================================================

export async function updateBranch(req, res) {
  try {
    const {
      name,
      code,
      description,
      image,
    } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (code !== undefined) {
      updateData.code = code.trim().toUpperCase();
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (image !== undefined) {
      updateData.image = image;
    }

    const branch =
      await Branch.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      branch,
    });

  } catch (error) {
    console.error("Update branch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update branch",
    });
  }
}


// =====================================================
// DELETE / DEACTIVATE BRANCH
// DELETE /api/branches/:id
// =====================================================

export async function deleteBranch(req, res) {
  try {
    const branch =
      await Branch.findByIdAndUpdate(
        req.params.id,
        {
          isActive: false,
        },
        {
          new: true,
        }
      );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
    });

  } catch (error) {
    console.error("Delete branch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete branch",
    });
  }
}