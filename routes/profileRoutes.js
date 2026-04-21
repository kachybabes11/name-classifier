import express from "express";
import {
  getProfiles,
  searchProfiles,
  createProfile,
  getSingleProfile,
  deleteProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", createProfile);
router.get("/", getProfiles);
router.get("/search", searchProfiles);
router.get("/:id", getSingleProfile);
router.delete("/:id", deleteProfile);

export default router;