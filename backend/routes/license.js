const express = require("express")

const licenseRouter = express.Router()

const licenseController = require('../controller/licenseController')


licenseRouter.post('/create',licenseController.createLicenseKey)
licenseRouter.get('/all', licenseController.getAllLicenses);
licenseRouter.post('/assign', licenseController.assignLicense);
licenseRouter.post('/validate',licenseController.validate)
licenseRouter.post('/validate-device', licenseController.checkDeviceId)


module.exports = licenseRouter