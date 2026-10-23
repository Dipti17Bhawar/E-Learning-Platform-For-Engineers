
import express from "express";

import {
  getBookmarks,
  addBookmark,
  removeBookmark,
} from "../controllers/bookmarkController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getBookmarks);
router.post("/:resourceId", protect, addBookmark);
router.delete("/:resourceId", protect, removeBookmark);

export default router;
