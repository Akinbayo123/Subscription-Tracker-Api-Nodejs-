import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const Profile = (req, res) => {
    res.json({ success: true, user: req.user });
}
export const updateProfile = async(req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // find logged in user
        const user = await User.findById(req.user._id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        // update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();

        // don’t return password
        const { password: _, ...userWithoutPassword } = updatedUser.toObject();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: userWithoutPassword,
        });
    } catch (error) {
        next(error);
    }
};