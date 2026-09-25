import express from "express";
import upload from "../middleware/upload.js";

import {
  createResource,
  getAllResources,
  getResourcesBySubject,
  getResourceById,
  deleteResource,
} from "../controllers/resource.js";

const router = express.Router();

// CREATE RESOURCE
router.post(
  "/",
  upload.single("file"),
  (req, res, next) => {
    console.log("========== MULTER DEBUG ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("==================================");

    next();
  },
  createResource
);

// GET ALL
router.get("/", getAllResources);

// GET BY SUBJECT
router.get(
  "/subject/:subjectId",
  getResourcesBySubject
);

// GET SINGLE
router.get("/:id", getResourceById);

// DELETE
router.delete("/:id", deleteResource);

export default router;