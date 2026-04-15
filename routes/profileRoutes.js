import express from "express";
import {
  createProfileController,
  getProfileByIdController,
  getAllProfilesController,
  deleteProfileController
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/profiles", createProfileController);
router.get("/profiles", getAllProfilesController);
router.get("/profiles/:id", getProfileByIdController);
router.delete("/profiles/:id", deleteProfileController);

export default router;