import express from "express";
import upload from "../middleware/upload.js";

import {
  createResource,
  getResources,
  getResourcesBySubject,
  getResource,
  deleteResource,
} from "../controllers/resourceController.js";

const router = express.Router();

// Add resource with PDF upload
router.post("/", upload.single("file"), createResource);

// Get all resources
router.get("/", getResources);

// Get resources of particular subject
router.get("/subject/:subjectId", getResourcesBySubject);

// Get single resource
router.get("/:id", getResource);

// Delete resource
router.delete("/:id", deleteResource);

export default router;