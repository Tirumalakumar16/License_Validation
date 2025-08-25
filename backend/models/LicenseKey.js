const {pool} = require('../config/db');




// Create users table if not exists
async function initCreateLicenseTable() {
    const db = pool();
  const query = `
    CREATE TABLE IF NOT EXISTS licenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      license_key VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(100),
      assigned_to VARCHAR(200)  ,
      created_by VARCHAR(100) NOT NULL,
      issued_by VARCHAR(100) ,
      device_id VARCHAR(100) ,
      type VARCHAR(100) ,
      assigned_status BOOLEAN DEFAULT FALSE,
      activated_at TIMESTAMP ,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  await db.execute(query);
}

module.exports = {
    initCreateLicenseTable,
}