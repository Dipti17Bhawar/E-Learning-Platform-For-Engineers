import express from "express";
import upload from "../middleware/upload.js";

import {
  createResource,
  getAllResources,
  getResourcesBySubject,
  getResourceById,
  getResourceFile,
  deleteResource,
} from "../controllers/resource.js";

const router = express.Router();

// ============================================
// CREATE RESOURCE
// ============================================

router.post(
  "/",
  upload.single("file"),
  (req, res, next) => {
    console.log(
      "========== MULTER DEBUG =========="
    );

    console.log(
      "BODY:",
      req.body
    );

    console.log(
      "FILE:",
      req.file
    );

    console.log(
      "=================================="
    );

    next();
  },
  createResource
);


// ============================================
// GET ALL RESOURCES
// ============================================

router.get(
  "/",
  getAllResources
);


// ============================================
// GET RESOURCES BY SUBJECT
// ============================================

router.get(
  "/subject/:subjectId",
  getResourcesBySubject
);


// ============================================
// GET PDF FROM MONGODB GRIDFS
// IMPORTANT: This must come BEFORE /:id
// ============================================

router.get(
  "/file/:id",
  getResourceFile
);


// ============================================
// GET SINGLE RESOURCE
// ============================================

router.get(
  "/:id",
  getResourceById
);


// ============================================
// DELETE RESOURCE
// ============================================

router.delete(
  "/:id",
  deleteResource
);

export default router;