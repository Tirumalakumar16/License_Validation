const express = require("express")

const userRouter = express.Router()

const userController = require('../controller/userController')

userRouter.get('/test',userController.test)

userRouter.post('/create',userController.createUser)
userRouter.post('/login',userController.loginUser)
userRouter.post('/send-reset-link',userController.sendPasswordResetLink)
userRouter.post('/reset-password',userController.resetPassword)
userRouter.post('/verify-otp',userController.verifyOtp)
userRouter.post('/resend-otp',userController.resendOtp)
 


module.exports= userRouter