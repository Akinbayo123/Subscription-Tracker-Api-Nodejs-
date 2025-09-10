import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET } from "../config/env.js";
import Blacklist from "../models/tokenBlacklist.model.js";

export const authorize = async(req, res, next) => {
    try {
        let token;
        // Check for "Bearer <token>"
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]; // extract token
        }
        if (!token) {
            res.status(401);
            throw new Error("Not authorized, no token provided");
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password -createdAt -updatedAt");

        if (!user) {
            res.status(401);
            throw new Error("Not authorized, invalid or expired token");
        }
        // check if blacklisted
        const isBlacklisted = await Blacklist.findOne({ token });
        if (isBlacklisted) return res.status(401).json({ error: "Token expired" });
        req.user = user;
        next(); // pass control to next middleware/route handler

    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message })
    }

};