const {pool} = require('../config/db');




// Create users table if not exists
async function initCreateTicketTable() {
    const db = pool();
  const query = `
    CREATE TABLE IF NOT EXISTS tickets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      license_key VARCHAR(100) NOT NULL,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(200) NOT NULL , 
      reason VARCHAR(255) NOT NULL,
      device_id VARCHAR(100) NOT NULL,
      type VARCHAR(100) NOT NULL,
      resolve_status BOOLEAN DEFAULT FALSE,
      resolved_by VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  await db.execute(query);
}

module.exports = {
    initCreateTicketTable,
}