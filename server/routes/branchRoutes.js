import express from "express";

import {
  createBranch,
  getBranches,
  getBranch,
  getBranchByCode,
  updateBranch,
  deleteBranch,
} from "../controllers/branch.js";

const router = express.Router();


// POST /api/branches
router.post("/", createBranch);


// GET /api/branches
router.get("/", getBranches);


// IMPORTANT:
// Must come BEFORE /:id
router.get(
  "/code/:code",
  getBranchByCode
);


// GET /api/branches/:id
router.get("/:id", getBranch);


// PUT /api/branches/:id
router.put("/:id", updateBranch);


// DELETE /api/branches/:id
router.delete("/:id", deleteBranch);


export default router;