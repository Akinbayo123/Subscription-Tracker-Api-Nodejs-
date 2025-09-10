import express from 'express'
import { PORT } from './config/env.js'
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import connectToDatabase from './database/mongodb.js'
import errorMiddleware from './middlewares/error.middleware.js'
import cookieParser from 'cookie-parser'
import { arjectmiddleware } from './middlewares/arcjet.middleware.js'
import workflowRouter from './routes/workflow.routes.js'
import adminUserRouter from './routes/admin/users.routes.js'
import { authorize } from './middlewares/auth.middleware.js'
import { isAdmin } from './middlewares/adminMiddleware.js'
import adminSubscriptionRouter from './routes/admin/subscriptions.route.js'




const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(arjectmiddleware)


app.get('/', (req, res) => {
    res.send("Welcome")
})

app.use('/api/v1/admin/users', authorize, isAdmin, adminUserRouter)
app.use('/api/v1/admin/subscriptions', authorize, isAdmin, adminSubscriptionRouter)

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', authorize, userRouter)
app.use('/api/v1/subscriptions', authorize, subscriptionRouter)
app.use('/api/v1/workflows', workflowRouter)

app.use(errorMiddleware)





app.listen(PORT, async() => {
    console.log(`Subscription tracker is running on http://localhost:${PORT}`);
    await connectToDatabase()
})



export default app