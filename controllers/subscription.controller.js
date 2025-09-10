import { workflowClient } from "../config/upstash.js"
import Subscription from "../models/subscription.model.js"
import { SERVER_URL } from "../config/env.js"
import dayjs from "dayjs";
export const createSubscription = async(req, res, next) => {
    try {

        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const result = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                "Content-Type": "application/json",
            },
            retries: 0,
        });
        console.log(`${SERVER_URL}`)
        res.status(201).json({
            success: true,
            data: { subscription, workflowRunId: result.workflowRunId, }
        });
    } catch (e) {
        next(e);
    }
};


export const getSubscription = async(req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id)

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }
        // Ensure the logged-in user owns this subscription
        if (subscription.user.toString() !== req.user.id) {
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }



        res.status(200).json({ success: true, data: subscription })

    } catch (error) {
        next(error)
    }
}

// export const updateSubscription = async(req, res, next) => {
//     try {
//         const subscription = await Subscription.findById(req.params.id);

//         if (!subscription) {
//             const error = new Error("Subscription not found");
//             error.statusCode = 404;
//             throw error;
//         }

//         // Ensure the logged-in user owns this subscription
//         if (subscription.user.toString() !== req.user.id) {
//             const error = new Error("Unauthorized access");
//             error.statusCode = 401;
//             throw error;
//         }

//         // Update with new data
//         const updatedSubscription = await Subscription.findByIdAndUpdate(
//             req.params.id, { $set: req.body }, { new: true, runValidators: true }
//         );

//         res.status(200).json({ success: true, data: updatedSubscription });
//     } catch (error) {
//         next(error);
//     }
// };

export const deleteSubscription = async(req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user.id) {
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }

        await subscription.deleteOne();

        res.status(200).json({ success: true, message: "Subscription deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const cancelSubscription = async(req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user.id) {
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }

        subscription.status = "cancelled";
        await subscription.save();

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};


// ✅ Get all subscriptions of a user with pagination
export const getUserSubscriptions = async(req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }

        // pagination params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // fetch subscriptions
        const [subscriptions, total] = await Promise.all([
            Subscription.find({ user: req.params.id })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
            Subscription.countDocuments({ user: req.params.id }),
        ]);

        res.status(200).json({
            success: true,
            count: subscriptions.length,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            data: subscriptions,
        });
    } catch (error) {
        next(error);
    }
};

// ✅ Upcoming subscriptions (7 days window) with pagination
export const upcomingSubscription = async(req, res, next) => {
    try {
        // pagination params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {
            user: req.user.id,
            renewalDate: {
                $gte: dayjs().toDate(),
                $lte: dayjs().add(7, "day").toDate(),
            },
            status: "active",
        };

        const [upcoming, total] = await Promise.all([
            Subscription.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ renewalDate: 1 }),
            Subscription.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count: upcoming.length,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            data: upcoming,
        });
    } catch (error) {
        next(error);
    }
};