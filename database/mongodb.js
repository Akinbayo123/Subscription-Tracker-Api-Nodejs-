import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from '../config/env.js'


if (!DB_URI) {
    // throw new Error("Please define a valid database uri")
    console.log("Please define a valid database uri");

}

const connectToDatabase = async() => {
    try {
        await mongoose.connect(DB_URI)
        console.log("Database connected successfully")
    } catch (error) {
        console.error("Error connecting to database:", error)
        process.exit(1)
    }
}

export default connectToDatabase