const express = require("express")

const ticketRouter = express.Router()

const ticketController = require('../controller/ticketController');
const authMiddleware = require("../middlewares/authMiddleware");


ticketRouter.post('/create',ticketController.raiseTicket); // This is unProtected Route
ticketRouter.get('/alltickets',authMiddleware,ticketController.getAllTickets) // This is Protected route
ticketRouter.put('/resolve',authMiddleware,ticketController.resolveTicket) // this is protected route for admin
















module.exports = ticketRouter