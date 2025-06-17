const bcrypt = require('bcryptjs');
const db = require('../config/db'); // connection pool
const jwt = require('jsonwebtoken');
require("dotenv").config();



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


async function loginUser(req, res) {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const connection = db.pool();

    // Fetch user from DB
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email },         // Payload
      process.env.JWT_SECRET,       // Secret
      { expiresIn: '30d' }          // Expiration
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      JWT_Token:token,
      name: user.name
    });

  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};



async function test(req, res) {
    return res.status(200).json({message : "testing",
        success : true})
}











module.exports = {
    test,
    createUser,
    loginUser
}