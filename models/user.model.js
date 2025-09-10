import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
    },
    email: {
        type: String,
        required: [true, "User email required"],
        unique: true,
        trim: true,
        minLength: 5,
        maxLength: 255,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "User password required"],
        trim: true,
        minLength: 6,
    },
    role: {
        type: String,
        enum: ["user", "admin"], // allowed roles
        default: "user", // default is user
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;