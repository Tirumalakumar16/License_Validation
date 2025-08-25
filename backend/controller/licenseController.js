const db = require('../config/db');
const { generateLicenseKey } = require('../utils/licenseGenerator');
const sendLicenseEmail = require('../utils/sendEmail');

async function createLicenseKey (req, res)  {
  try {

    const created_by = req.email;
    // console.log(req.email);
    
    const connection = db.pool();
//  console.log(created_by);
    const license_Key = generateLicenseKey();
    
    // console.log(license_Key); 
    
    const [result] = await connection.execute(
      `INSERT INTO licenses (\`license_key\`, created_by) VALUES (?, ?)`,
      [license_Key, created_by]
    );

    return res.status(201).json({
      success: true,
      message: 'License key created',
      license_Key,
      id: result.insertId
    });
  } catch (err) {
    console.error('License creation error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to create license key' });
  }
};




async function getAllLicenses(req, res){
  try {
    const connection = db.pool();
    const [rows] = await connection.execute('SELECT * FROM licenses ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch licenses' });
  }
};

 

async function assignLicense(req, res) {
  let { licenseKey, name, assigned_to,type } = req.body;
  let issued_by = req.email
  // console.log(licenseKey);
  
   
  
  if (!licenseKey || !assigned_to || !name || !type) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  } 

  console.log(licenseKey , name , assigned_to, type);
  
  try {
    const connection = db.pool();

    // Assign license

    type = type.toUpperCase();

    const [result] = await connection.execute(
      `UPDATE licenses
       SET assigned_to = ?, name = ?,issued_by = ?, type =?,  assigned_status = 1, updated_at = NOW()
       WHERE license_key = ?`,
      [assigned_to, name,issued_by,type ,licenseKey]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'License not found' });
    }

    // Send email
   const htmlContentMobile = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 20px;">
      <h2 style="color: #1a73e8; text-align: center;">🔐 Practical Infosec License Assigned</h2>
      <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>
      
      <p style="font-size: 15px; line-height: 1.6;">
        We are pleased to inform you that a license key has been assigned to you for using the <strong>Practical Infosec Mobile APK</strong> for penetration testing training. Please find the details below and ensure they are kept secure:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 15px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>📛 Name:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>🔑 License Key:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><code style="color: #d6336c; font-weight: bold;">${licenseKey}</code></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>📧 Assigned To:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${assigned_to}</td>
        </tr>
      </table>

      <div style="margin-top: 30px; text-align: center;">
        <a href="https://practicalinfosec.com/downloadFiles/Apps/practicalinfosec_bank-v1.1.apk"
           style="display: inline-block; padding: 12px 24px; background-color: #1d4ed8; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 6px; cursor: pointer;"
           >
          📲 Download Mobile APK
        </a>
      </div>

      <p style="font-size: 15px; margin-top: 25px;">
        Please do not share this APK or license key with anyone else. It is intended for your use only in our penetration testing labs and mobile simulations.
      </p>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />

      <p style="font-size: 15px; color: #111827; margin-top: 20px;">
        Kind regards,<br/>
        <span style="color: #2563eb; font-weight: 600;">Practical Infosec Support Team</span><br/>
        <a href="https://practicalinfosec.com" style="color: #1d4ed8; text-decoration: none;">https://practicalinfosec.com</a>
      </p>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 13px; color: #999; text-align: center;">
        This is an automated message. Please do not reply directly to this email. For support, contact us via our email:support@practicalinfosec.com.
      </p>
    </div>
  </div>
`;


 // Send email
   const htmlContentDesktop = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 20px;">
      <h2 style="color: #1a73e8; text-align: center;">🔐 Practical Infosec License Assigned</h2>
      <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>
      
      <p style="font-size: 15px; line-height: 1.6;">
        We are pleased to inform you that a license key has been assigned to you for using the <strong>Practical Infosec Desktop Application</strong> for penetration testing training. Please find the details below and ensure they are kept secure:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 15px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>📛 Name:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>🔑 License Key:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><code style="color: #d6336c; font-weight: bold;">${licenseKey}</code></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>📧 Assigned To:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${assigned_to}</td>
        </tr>
      </table>

      <div style="margin-top: 30px; text-align: center;">
        <a href="https://practicalinfosec.com/downloadFiles/Apps/practicalinfosec_bank-v1.1.apk"
           style="display: inline-block; padding: 12px 24px; background-color: #1d4ed8; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 6px; cursor: pointer;"
           >
          💻 Download Desktop Application
        </a>
      </div>

      <p style="font-size: 15px; margin-top: 25px;">
        Please do not share this Application or license key with anyone else. It is intended for your use only in our penetration testing labs and Desktop App simulations.
      </p>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />

      <p style="font-size: 15px; color: #111827; margin-top: 20px;">
        Kind regards,<br/>
        <span style="color: #2563eb; font-weight: 600;">Practical Infosec Support Team</span><br/>
        <a href="https://practicalinfosec.com" style="color: #1d4ed8; text-decoration: none;">https://practicalinfosec.com</a>
      </p>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 13px; color: #999; text-align: center;">
        This is an automated message. Please do not reply directly to this email. For support, contact us via our email:support@practicalinfosec.com.
      </p>
    </div>
  </div>
`;

  // Decide which email to send
    let subject, htmlContent;

    if (type === "MOBILE") {
      subject = "Your License Key For Mobile APK - Practical Infosec";
      htmlContent = htmlContentMobile;
    } else {
      subject = "Your License Key For Desktop Application - Practical Infosec";
      htmlContent = htmlContentDesktop;
    }

    // Send only one email
    await sendLicenseEmail(assigned_to, subject, htmlContent);

    res.status(200).json({
      success: true,
      message: `License assigned and ${type} email sent`,
      assignedName: name,
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Assignment failed' });
  }
};



/// Validate from phone or emulator
async function validate(req, res) {
  const { device_id, licenseKey } = req.body;

  if (!device_id || !licenseKey) {
    return res.status(400).json({ success: false, message: 'device_id and licenseKey are required.' });
  }

  
  

  try {
    const connection =   db.pool(); // for mysql2/promise
// console.log(device_id,licenseKey);

    // Check if license key exists and fetch it
    const [licenseRows] = await connection.query(
      'SELECT * FROM licenses WHERE license_key = ?',
      [licenseKey]
    );

    // console.log(licenseRows);
    
    if (licenseRows.length === 0) {
      return res.status(404).json({ success: false, message: 'License key not found.' });
    }

    const license = licenseRows[0];

    // Check if device_id is already set
    if (license.device_id != null && license.device_id != device_id) {
      return res.status(409).json({
        success: false,
        message: 'This license key is already activated on another device.'
      });
    } 

     if (license.device_id == device_id) {
      return res.json({
        success: true,
        message: 'This Device_id is already used license Key.'
      });
    } 
 
    // Update license with new device_id and activation time
    await connection.query(
      'UPDATE licenses SET device_id = ?, activated_at = NOW(), updated_at = NOW() WHERE license_key = ?',
      [device_id, licenseKey]
    );

    return res.json({ success: true, message: 'License key validated and activated.' });

  } catch (err) {
    console.error('License validation error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}


async function checkDeviceId (req, res) {
  const { device_id } = req.body;

  if (!device_id) {
    return res.status(400).json({ success: false, message: 'Device ID is required' });
  }

  try {

    const connection = db.pool();
    const [rows] = await connection.execute('SELECT * FROM licenses WHERE device_id = ?', [device_id]);

    if (rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Device ID exists in the system',
       
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Device ID not found in licenses table',
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking device ID',
    });
  }
};


module.exports = {
    createLicenseKey,
    assignLicense,
    getAllLicenses,
    validate,
    checkDeviceId
}