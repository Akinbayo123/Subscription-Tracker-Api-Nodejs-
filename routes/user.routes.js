import { Router } from "express"

import { Profile, updateProfile } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.get("/profile", Profile);
userRouter.put("/update-profile", updateProfile);
export default userRouter