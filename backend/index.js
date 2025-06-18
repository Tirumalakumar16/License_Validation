const express = require('express');
const cors = require('cors');

const app = express();
require("dotenv").config();
const cookieParser = require('cookie-parser');
app.use(cors());

const {initUserTable} = require('./models/User')
const {initCreateLicenseTable} = require('./models/LicenseKey')
const {initCreateTicketTable} = require('./models/Ticket')
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/user')
const licenseRoutes = require('./routes/license');
const ticketRoutes = require('./routes/ticket')
const authMiddleware = require('./middlewares/authMiddleware');






app.use(express.urlencoded())
app.use(express.json())

app.use(cookieParser())


app.use('/api/user',userRoutes)
app.use('/api/license',authMiddleware,licenseRoutes)

app.use('/api/phone',licenseRoutes)
app.use('/api/ticket',ticketRoutes)

 

const PORT = process.env.SERVER_PORT ;

const startServer = async () => {
  await connectDB(); // ✅ Logs "MySQL Database connected..."
  await initUserTable();
  await initCreateLicenseTable();
  await initCreateTicketTable();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
   
};

startServer();