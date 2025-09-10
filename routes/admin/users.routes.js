import { Router } from "express"
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../../controllers/admin.controller.js"



const adminUserRouter = Router()

adminUserRouter.get('/', getUsers)

adminUserRouter.get('/:id', getUser)

adminUserRouter.post('/', createUser)

adminUserRouter.put('/:id', updateUser)

adminUserRouter.delete('/:id', deleteUser)

export default adminUserRouter