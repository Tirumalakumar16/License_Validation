// const nodemailer = require('nodemailer');
require('dotenv').config();

// import {Resend} from 'resend'

 let {Resend} = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)



 
// const sendLicenseEmail = async (to, subject, htmlContent) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to,
//     subject,
//     html: htmlContent,
    
//   });
// };

async function sendEmail(to, subject, htmlContent) {
  try {
    const response = await resend.emails.send({
      from: 'no-reply@practicalinfosec.com',  // Use your verified sender email
      to: to,
      subject: subject,
      html: htmlContent,
    });

    // console.log('Email sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = sendEmail;

