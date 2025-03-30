import express from "express";
//IP me limmit lagana
import rateLimit from "express-rate-limit";

//IP limmiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

import {
  loginController,
  registerController,
} from "../controllers/authController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes

/**
 * @swagger
 * components:
 * schemas:
 *    user:
 *      type: Object
 *      required:
 *        -name
 *        -lastName
 *        -email
 *        -password
 *        -location
 *      properties:
 *        id:
 *          type:string
 *          description: The auto generated id of user collection
 *        name:
 *          type:string
 *          description: user name
 *
 *        lastName:
 *          type:string
 *          description: user last name
 *        email:
 *          type:string
 *          description: user email
 *        password:
 *          type:string
 *          description: user hash password should be gratter than 6 chareter
 *        location:
 *          type:string
 *          description: user hash password should be gratter than 6 chareter
 *        example:
 *          name: Raj
 *          lastName: Kumar
 *          password: XXXXXXXX
 *          email: raj@gmail.com
 *          location: mumbai
 */

//register || post
router.post("/register", limiter, registerController);
//login ||post
router.post("/login", limiter, loginController);

export default router;
