import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      reqired: [true, "Company is required"],
    },
    position: {
      type: String,
      reqired: [true, "Job position is required"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "reject", "ineterview"],
    },
    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },
    workLocation: {
      type: String,
      default: "Ranchi",
      required: [true, "Work location required"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
