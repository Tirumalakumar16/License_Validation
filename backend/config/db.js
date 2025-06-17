const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;
  
const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: "mysql-rds-db.cv66g0824fc9.ap-south-1.rds.amazonaws.com",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
   
    // Test a simple query to ensure connection works
    await pool.query('SELECT 1');
    console.log('✅ MySQL Database connected and pool initialized');
  } catch (err) {
    console.error('❌ MySQL Connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  pool: () => pool
};