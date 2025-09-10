import { Router } from "express"

import * as Controller from "../../controllers/admin.controller.js"

const adminSubscriptionRouter = Router()

adminSubscriptionRouter.get("/", Controller.getSubscriptions);
adminSubscriptionRouter.get("/user/:userId", Controller.getUserSubscriptions);
adminSubscriptionRouter.get("/:id", Controller.getSubscription);
adminSubscriptionRouter.delete("/:id", Controller.deleteSubscription);
adminSubscriptionRouter.put("/:id/cancel", Controller.cancelSubscription);

export default adminSubscriptionRouter