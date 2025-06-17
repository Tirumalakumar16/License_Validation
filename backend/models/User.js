const {pool} = require('../config/db');

// Create users table if not exists
async function initUserTable() {
    const db = pool();
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(200) NOT NULL UNIQUE,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) ,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  await db.execute(query);
}

// Create users table if not exists
async function initAssignLicenseTable() {
    const db = pool();
  const query = `
    CREATE TABLE IF NOT EXISTS licenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      license_key VARCHAR(100) NOT NULL,
      email VARCHAR(200) NOT NULL UNIQUE,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) ,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  await db.execute(query);
}

 
module.exports = {
  initUserTable,
  
};