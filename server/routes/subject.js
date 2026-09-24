import express from "express";

import {
  createSubject,
  getSubjects,
  getSubjectsByBranch,
  getSubject,
  deleteSubject,
} from "../controllers/subject.js";

const router = express.Router();


// ADD SUBJECT
// POST /api/subjects
router.post("/", createSubject);


// GET ALL SUBJECTS
// GET /api/subjects
router.get("/", getSubjects);


// GET SUBJECTS BY BRANCH
// GET /api/subjects/branch/:branchId
router.get(
  "/branch/:branchId",
  getSubjectsByBranch
);


// GET SINGLE SUBJECT
// GET /api/subjects/:id
router.get("/:id", getSubject);


// DELETE SUBJECT
// DELETE /api/subjects/:id
router.delete("/:id", deleteSubject);


export default router;