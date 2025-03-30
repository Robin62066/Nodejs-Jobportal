import { urlencoded } from 'express';
import mongoose from 'mongoose'

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Connecte to MongoDB Atles server ${mongoose.connection.host}`.bgMagenta.white);
        
    } catch (error) {
        console.log(`MongoDB Error ${error}`.bgRed.white);
        
    }
}
export default connectDB