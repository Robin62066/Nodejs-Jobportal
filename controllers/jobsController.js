import mongoose from "mongoose";
import jobsModel from "../model/jobsModel.js";
import moment from "moment";
import { query } from "express";

export const createJobController = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("Please Provide all Fields");
  }

  req.body.createdBy = req.user.userId;
  const job = await jobsModel.create(req.body);
  res.status(201).json({ job });
};
//all jobs
export const getAllJobs = async (req, res) => {
  //   const jobs = await jobsModel.find({ createdBy: req.user.userId });

  //for searching purpos
  const { status, workType, search, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };
  //filters logic
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  //

  let queryResult = jobsModel.find(queryObject);
  //sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }
//page numbers paginations
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  queryResult = queryResult.skip(skip).limit(limit)

  //job count
  const totalJobs = await jobsModel.countDocuments(queryResult)
  const numOfPage = Math.ceil(totalJobs/limit)

  const jobs = await queryResult;

  res.status(200).json({
    totalJobs,
    jobs,
    numOfPage
  });
};

export const updateJobs = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;

  //validaation
  if (!company || !position) {
    next("Please provide all feilds");
  }

  //find job
  const job = await jobsModel.findOne({ _id: id });
  if (!job) {
    next(`No jobs found with this id ${id}`);
  }

  //   check the man who is created
  if (!req.user.userId === job.createdBy.toString()) {
    next("your r not authorized to update the jobs");
    return;
  }
  //update the jobs
  const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  //res
  res.status(200).json({ updateJob });
};

export const deleteJobs = async (req, res, next) => {
  const { id } = req.params;

  //find the job
  const job = await jobsModel.findOne({ _id: id });

  //validate job
  if (!job) {
    next("No jobs found with this id");
  }
  if (!req.user.userId == job.createdBy.toString()) {
    next("You are not authorized to delete");
    return;
  }
  await job.deleteOne();
  res.status(200).json({ message: "Job deleted successfully" });
};

//job stats controller
export const jobStatsController = async (req, res, next) => {
  const stats = await jobsModel.aggregate([
    //search by user jobs
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    //this is searching for the spacific column or data
    {
      $group: {
        _id: "$location",
        count: { $sum: 1 },
      },
    },
  ]);
  //here is defasult stats
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  //monthly yearly stats
  let monthlyApplication = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res
    .status(200)
    .json({ totalJob: stats.length, defaultStats, monthlyApplication });
};
