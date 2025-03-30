//const express = require('express')
import "express-async-errors";
//for documentations
import swaggerUi from "swagger-ui-express";
import swagerDoc from "swagger-jsdoc";

import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
import cors from "cors";
import morgan from "morgan";

//security
import helmet from "helmet";
import xss from "xss-clean";
import mongoSenetise from "express-mongo-sanitize";

import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js";
import jobRoute from "./routes/jobsRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

//configure dotenve
dotenv.config();

//mongodb connection
connectDB();

//swagger api configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal application",
      description: "Node express job portal Application",
    },
    servers: [
      {
        //here pass url if local and node
        url: "https://nodejs-jobportal-5v83.onrender.com/",
      },
    ],
  },
  apis: ["../routes/*.js"],
};
const spec = swagerDoc(options);

//creating rest object for routing
const app = express();

//moddleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(xss());
app.use(mongoSenetise());

//routess
// app.get('/',(req, res)=>{
//     res.send("<h1>Welcome to job Protal </h1>");
// });
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/job", jobRoute);

//home route for doc
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

// volidation middleware
app.use(errorMiddleware);

const port = process.env.PORT || 8080;

//listining for server
app.listen(8080, () => {
  console.log(
    `Node Server is running in ${process.env.DEV_MODE} mode port at ${process.env.PORT}`
      .bgCyan
  );
});
