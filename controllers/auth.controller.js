import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js"
import User from "../models/user.model.js"
import Blacklist from "../models/tokenBlacklist.model.js"

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with role
    const newUsers = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
          role: "user", // default role
        },
      ],
      { session }
    );

    const user = newUsers[0].toObject();
    delete user.password; // remove password before sending

    // Generate token with userId
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User successfully created",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};


export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly include password for verification
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password before sending
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    next(error);
  }
};



export const signOut = async(req, res, next) => {
    try {
        const token = req.headers.authorization ?.split(" ")[1];
        if (!token) return res.status(400).json({ error: "No token provided" });

        // Decode to get expiry
        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000);

        // Save to blacklist
        await Blacklist.create({ token, expiresAt });

        res.status(200).json({ success: true, message: "Signed out successfully" });
    } catch (error) {
        next(error);
    }
};