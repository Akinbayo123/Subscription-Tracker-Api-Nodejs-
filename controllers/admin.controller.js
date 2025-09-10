import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import Subscription from "../models/subscription.model.js";

export const getUsers = async(req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // default page = 1
        const limit = parseInt(req.query.limit) || 10; // default 10 per page
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select("-password")
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalUsers: total,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};


export const getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) {
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }
        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error)
    }
}


// Admin creates a new user
export const createUser = async(req, res, next) => {
    try {
        const { name, email, password, role = "user" } = req.body;

        // check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const safeUser = user.toObject();
        delete safeUser.password;

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: safeUser,
        });
    } catch (error) {
        next(error);
    }
};

// Admin updates user info
export const updateUser = async(req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        let updateData = { name, email, role };

        // if password is being updated, hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id, { $set: updateData }, { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// Admin deletes a user
export const deleteUser = async(req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};


// Get all subscriptions (with pagination + sorting + filtering)
export const getSubscriptions = async(req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = "-createdAt", status, category, paymentMethod } = req.query;

        // Build filter object dynamically
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (paymentMethod) filter.paymentMethod = paymentMethod;

        const subscriptions = await Subscription.find(filter)
            .populate("user", "name email") // show who owns it
            .sort(sort) // e.g., -createdAt or renewalDate
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Subscription.countDocuments(filter);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: subscriptions,
        });
    } catch (error) {
        next(error);
    }
};

// Get a single subscription
export const getSubscription = async(req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id).populate("user", "name email");
        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

// Get subscriptions for a specific user (with pagination + filters)
export const getUserSubscriptions = async(req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = "-createdAt", status } = req.query;

        const filter = { user: req.params.userId };
        if (status) filter.status = status;

        const subscriptions = await Subscription.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Subscription.countDocuments(filter);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: subscriptions,
        });
    } catch (error) {
        next(error);
    }
};

// Delete a subscription
export const deleteSubscription = async(req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);
        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, message: "Subscription deleted" });
    } catch (error) {
        next(error);
    }
};

// Cancel a subscription (mark as cancelled)
export const cancelSubscription = async(req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        subscription.status = "cancelled";
        // subscription.cancelledAt = dayjs().toDate();
        await subscription.save();

        res.status(200).json({
            success: true,
            message: "Subscription cancelled",
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};