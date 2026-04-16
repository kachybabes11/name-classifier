import express from "express";
import {
  createProfile,
  getSingleProfile,
  getProfiles,
  deleteProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", createProfile);
router.get("/", getProfiles);
router.get("/:id", getSingleProfile);
router.delete("/:id", deleteProfile);

export default router;