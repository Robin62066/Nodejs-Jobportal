import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { updateUserController } from '../controllers/userController.js'



//route object 
const router = express.Router();

//routes
//GET All users

//update Users
router.put('/update-user',userAuth, updateUserController)

export default router