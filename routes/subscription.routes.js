import { Router } from "express"
import * as Controller from "../controllers/subscription.controller.js"
const subscriptionRouter = Router()


subscriptionRouter.get('/user/:id', Controller.getUserSubscriptions)
subscriptionRouter.get('/upcoming-subscriptions', Controller.upcomingSubscription)
subscriptionRouter.get('/:id', Controller.getSubscription)
subscriptionRouter.post('/', Controller.createSubscription)
    // subscriptionRouter.put('/:id', Controller.updateSubscription)
subscriptionRouter.delete('/:id', Controller.deleteSubscription)
subscriptionRouter.put('/:id/cancel', Controller.cancelSubscription)


export default subscriptionRouter