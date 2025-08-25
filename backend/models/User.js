const {pool} = require('../config/db');

// Create users table if not exists and insert dummy data
async function initUserTable() {
  const db = pool();
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(200) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20),
      otp VARCHAR(6),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  await db.execute(query);

  // Check if table is empty
  const [rows] = await db.execute(`SELECT COUNT(*) AS count FROM users`);
  if (rows[0].count === 0) {
    const insertQuery = `
      INSERT INTO users (name, email, password, role, otp)
      VALUES 
        ('Tirumala Kumar K', 'kumarktk4169@gmail.com', 'Tirumala@16', 'ADMIN', NULL),
        ('Gopala Krishna A', 'a.gopalakrishna414@gmail.com', 'Gopal@26', 'ADMIN', NULL)
    `;
    await db.execute(insertQuery);
    console.log("✅ users inserted");
  } else {
    console.log("ℹ️ Users table already has data, skipping dummy insert");
  }
}


 
module.exports = {
  initUserTable,
  
};