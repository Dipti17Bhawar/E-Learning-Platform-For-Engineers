import express from "express";

import {
  createResource,
  getResources,
  getResourcesBySubject,
  getResource,
  deleteResource,
} from "../controllers/resource.js";

const router = express.Router();

// Add resource
router.post("/", createResource);

// Get all resources
router.get("/", getResources);

// Get resources of a particular subject
router.get("/subject/:subjectId", getResourcesBySubject);

// Get single resource
router.get("/:id", getResource);

// Delete resource
router.delete("/:id", deleteResource);

export default router;