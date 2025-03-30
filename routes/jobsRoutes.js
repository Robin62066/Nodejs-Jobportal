import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createJobController,
  deleteJobs,
  getAllJobs,
  jobStatsController,
  updateJobs,
} from "../controllers/jobsController.js";

const router = express.Router();

// Routes
router.post("/create-job", userAuth, createJobController);
//get all jobs
router.get("/get-job", userAuth, getAllJobs);

//update jobs || put
router.put("/update-job/:id", userAuth, updateJobs);
//edit jobs || put
router.delete("/delete-job/:id", userAuth, deleteJobs);
//job stats filter || get
router.get("/job-stats", userAuth, jobStatsController);

export default router;
