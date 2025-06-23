const bcrypt = require('bcryptjs');
const db = require('../config/db'); // connection pool
const jwt = require('jsonwebtoken');
require("dotenv").config();
const nodemailer = require('nodemailer');


async function createUser(req, res) {
  let { name, email, username, password, role } = req.body;


  

  // Input validations
  if (!name || name.length < 3) {
    return res.status(400).json({
      success: false,
      message: "Name is required and should be at least 3 characters long",
    });
  }

  if (!email ) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!username ||  username.length < 3) {
    return res.status(400).json({
      success: false,
      message: "Username is required and length should be >3",
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password is required and should be at least 6 characters",
    });
  }

  try {
    const connection = db.pool();

    // Check for existing email or username
    const [existing] = await connection.execute(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email or username already exists",
      });
    }

     // Hashing the password
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert into DB
    const [result] = await connection.execute(
      `INSERT INTO users (name, email, username, password, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, username, hashedPassword, role]
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: result.insertId,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User creation failed",
    });
  }
}

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

async function loginUser(req, res) {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {

    const connection = db.pool();

    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate OTP and update in DB
    const otp = generateOTP();
    await connection.execute("UPDATE users SET otp = ? WHERE email = ?", [otp, email]);

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const htmlContent = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9fafb; padding: 24px; border-radius: 10px; max-width: 600px; margin: auto;">
    <h2 style="color: #1d4ed8; margin-bottom: 10px;">🔐 Two-Factor Authentication (OTP Required)</h2>
    
    <p style="font-size: 16px; color: #111827;">Hello <strong>${user.name }</strong>,</p>
    
    <p style="font-size: 15px; color: #374151; margin: 10px 0;">
      As part of our enhanced security, a One-Time Password (OTP) has been generated to complete your login to 
      <strong>Practical Infosec</strong>. Please use the following OTP:
    </p>
    
    <div style="margin: 20px 0; text-align: center;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1d4ed8;">${otp}</span>
    </div>

    <p style="font-size: 14px; color: #374151;">
      🔒 This OTP is valid for <strong>one-time use only</strong> and will expire shortly.
    </p>

    <p style="font-size: 14px; color: #ef4444; font-weight: 500;">
      Do not share this OTP with anyone. Our team will never ask for your OTP.
    </p>

    <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />

    <p style="font-size: 14px; color: #6b7280;">
      If you did not attempt to log in, please contact our support team immediately.
    </p>

    <p style="margin-top: 24px; font-size: 14px; color: #111827;">
      Regards,<br/>
      <strong style="color: #2563eb;">Practical Infosec Support Team</strong><br/>
      <a href="https://practicalinfosec.com" style="color: #2563eb; text-decoration: none;">https://practicalinfosec.com</a>
    </p>
  </div>
`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Your Login OTP - Practical Infosec',
      html: htmlContent,
    });

    // Issue temp token (not full auth yet)
    const tempToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });

    res.json({ success: true, message: "OTP sent to email", token: tempToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

async function resendOtp (req, res){
  const { token } = req.body;

   const connection = db.pool();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

  const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

  if (!user) {
    return res.status(404).json({ success: false, message: "Email not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await connection.query("UPDATE users SET otp = ? WHERE email = ?", [otp, email]);

  // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const htmlContent = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9fafb; padding: 24px; border-radius: 10px; max-width: 600px; margin: auto;">
    <h2 style="color: #1d4ed8; margin-bottom: 10px;">🔐 Two-Factor Authentication (OTP Required)</h2>
    
    <p style="font-size: 16px; color: #111827;">Hello <strong>${user.name }</strong>,</p>
    
    <p style="font-size: 15px; color: #374151; margin: 10px 0;">
      As part of our enhanced security, a One-Time Password (OTP) has been generated to complete your login to 
      <strong>Practical Infosec</strong>. Please use the following OTP:
    </p>
    
    <div style="margin: 20px 0; text-align: center;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1d4ed8;">${otp}</span>
    </div>

    <p style="font-size: 14px; color: #374151;">
      🔒 This OTP is valid for <strong>one-time use only</strong> and will expire shortly.
    </p>

    <p style="font-size: 14px; color: #ef4444; font-weight: 500;">
      Do not share this OTP with anyone. Our team will never ask for your OTP.
    </p>

    <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />

    <p style="font-size: 14px; color: #6b7280;">
      If you did not attempt to log in, please contact our support team immediately.
    </p>

    <p style="margin-top: 24px; font-size: 14px; color: #111827;">
      Regards,<br/>
      <strong style="color: #2563eb;">Practical Infosec Support Team</strong><br/>
      <a href="https://practicalinfosec.com" style="color: #2563eb; text-decoration: none;">https://practicalinfosec.com</a>
    </p>
  </div>
`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Your Resend Login OTP - Practical Infosec',
      html: htmlContent,
    });

  res.json({ success: true, message: "OTP sent to your email" });
}

async function verifyOtp (req, res) {
  const { token, otp } = req.body;

  try {
    const connection = db.pool();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user || user.otp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP after verification
    await connection.execute("UPDATE users SET otp = NULL WHERE email = ?", [email]);

    // Issue final token
    const realToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15d' });

    res.json({ success: true, message: "OTP verified", realToken ,name:user.name});
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

async function test(req, res) {
    return res.status(200).json({message : "testing",
        success : true})
}







async function sendPasswordResetLink(req, res) {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'Valid email is required.' });
  }

  try {
     const connection = db.pool();
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'No user found with that email.' });
    }

    const user = users[0];

    // Generate token (expires in 15 min)
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    // console.log(token);
    // console.log(resetLink);
    // console.log(user);
    
    
    
   const htmlContent = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f3f4f6; padding: 32px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <h2 style="color: #1d4ed8;">🔐 Reset Your Password</h2>
    <p style="font-size: 16px; color: #374151;">Hello <strong>${user.name || user.email}</strong>,</p>
    <p style="font-size: 15px; color: #4b5563;">
      We received a request to reset your password. To proceed, please click the button below:
    </p>

    <div style="margin: 24px 0;">
      <a href="${resetLink}"
         style="padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none;
                border-radius: 6px; display: inline-block; font-weight: 600; cursor: pointer;">
        🔁 Reset Password
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280;">
      This secure link will expire in <strong>15 minutes</strong>. If you didn’t request this, please ignore this email.
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

    <p style="font-size: 14px; color: #4b5563;">
      Need help? Contact us anytime at <a href="mailto:support@practicalinfosec.com" style="color: #1d4ed8;">support@practicalinfosec.com</a>
    </p>

    <p style="margin-top: 16px; font-size: 13px; color: #9ca3af;">
      Sent by Practical Infosec<br>
      <a href="https://practicalinfosec.com" style="color: #1d4ed8;">https://practicalinfosec.com</a>
    </p>
  </div>
`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Reset Your Password - Practical Infosec',
      html: htmlContent
    });

    return res.json({ success: true, message: 'Reset link sent to your email.' });

  } catch (err) {
    console.error('Reset link error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};




async function resetPassword(req, res){

  const { token, newPassword } = req.body;

   


  // 1. Validate input
  if (!token || !newPassword) {
    return res.status(400).json({ success: false, message: 'Token and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  try {

     const connection = db.pool();
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.email) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const email = decoded.email;

    // 3. Check if user exists
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. Update password
    await connection.execute('UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?', [
      hashedPassword,
      email,
    ]);

    const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const htmlContent = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f3f4f6; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); text-align: center;">
    <h2 style="color: #1d4ed8;">🔐 Password Reset Successfully</h2>
    <p style="font-size: 16px; color: #111827;">Hello <strong>${email}</strong>,</p>
    <p style="font-size: 15px; color: #374151;">Your password has been successfully updated.</p>
    <p style="font-size: 14px; color: #6b7280;">Time: <strong>${new Date().toLocaleString()}</strong></p>
    <p style="font-size: 14px; color: #6b7280;">If you did not initiate this change, please contact our support team immediately.</p>
    <div style="margin-top: 20px;">
      <a href="https://practicalinfosec.com" style="padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">Visit Practical Infosec</a>
    </div>
    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">Regards,<br/><strong>Practical Infosec Support Team</strong></p>
  </div>
`;

await transporter.sendMail({
  from: `"Practical Infosec" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: '🔐 Password Reset Confirmation',
  html: htmlContent,
});

    return res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(401).json({ success: false, message: 'Invalid or expired reset token' });
  }
};


module.exports = {
    test,
    createUser,
    loginUser,
    sendPasswordResetLink,
    resetPassword,
    resendOtp,
    verifyOtp
}