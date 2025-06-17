const express = require("express")

const userRouter = express.Router()

const userController = require('../controller/userController')

userRouter.get('/test',userController.test)

userRouter.post('/create',userController.createUser)
userRouter.post('/login',userController.loginUser)



module.exports= userRouter