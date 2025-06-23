const nodemailer = require('nodemailer');
require('dotenv').config();




const sendLicenseEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: htmlContent,
    
  });
};

module.exports = sendLicenseEmail;