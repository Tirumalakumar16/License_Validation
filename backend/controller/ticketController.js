
const db = require('../config/db');
const nodemailer = require('nodemailer');




async function raiseTicket(req, res) {


  const { licenseKey,email, reason } = req.body;

  // console.log(licenseKey,email,reason);
  
  if (!licenseKey || !reason ) {
    return res.status(400).json({ success: false, message: 'licenseKey and reason are required.' });
  }

  try {

    const connection = db.pool();  // use mysql2/promise style

    // Step 1: Check if licenseKey exists in licenses table
    const [licenseRows] = await connection.query(
      'SELECT name, assigned_to, device_id FROM licenses WHERE license_key = ?',
      [licenseKey]
    );

    if (licenseRows.length === 0) {
      return res.status(404).json({ success: false, message: 'License key not found.' });
    }

    const { name, assigned_to, device_id } = licenseRows[0];

    if(email != assigned_to) {
      return res.status(400).json({ success: false, message: 'EmailId is not found.' });
    }

    // Step 2: Insert new ticket
    await connection.query(
      `INSERT INTO tickets (license_key, name, email, reason, device_id)
       VALUES (?, ?, ?, ?, ?)`,
      [licenseKey, name, assigned_to, reason, device_id]
    );

     // 4. Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

   const htmlContent = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f3f4f6; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #2563eb; padding: 16px 24px; border-radius: 8px 8px 0 0; color: white;">
      <h2 style="margin: 0; font-size: 20px;">📩 Ticket Created Successfully</h2>
    </div>
    <div style="background-color: white; padding: 24px; border-radius: 0 0 8px 8px;">
      <p style="font-size: 16px; color: #111827; margin-bottom: 12px;">
        Hello <strong>${name}</strong>,
      </p>

      <p style="font-size: 15px; color: #374151; margin-bottom: 16px;">
        Thank you for reaching out. Your support ticket has been received and our team is currently reviewing it.
      </p>

      <div style="background-color: #f0f9ff; padding: 12px 20px; border-left: 4px solid #2563eb; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 16px;"><strong>License Key:</strong> ${licenseKey}</p>
        <p style="margin: 0; font-size: 14px; color: #4b5563;"><strong>Email:</strong> ${assigned_to}</p>
        <p style="margin: 0; font-size: 14px; color: #4b5563;"><strong>Device ID:</strong> ${device_id}</p>
        <p style="margin: 0; font-size: 14px; color: #4b5563;"><strong>Reason:</strong> ${reason}</p>
      </div>

      <p style="font-size: 15px; color: #374151; margin-bottom: 16px;">
        You’ll receive a follow-up email once your issue has been reviewed or resolved. Our goal is to address all inquiries within 24–48 hours.
      </p>

      <p style="font-size: 14px; color: #6b7280;">Submitted on: <strong>${new Date().toLocaleString()}</strong></p>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />

      <p style="font-size: 15px; color: #111827; margin-top: 20px;">
        Kind regards,<br/>
        <span style="color: #2563eb; font-weight: 600;">Practical Infosec Support Team</span><br/>
        <a href="https://practicalinfosec.com" style="color: #1d4ed8; text-decoration: none;">https://practicalinfosec.com</a>
      </p>
    </div>
  </div>
`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: assigned_to,
      subject: '🎫 Ticket Created Successfully - Practical Infosec Support',
      html: htmlContent
    });

    return res.json({ success: true, message: 'Ticket raised successfully.' });

  } catch (err) {
    console.error('Error raising ticket:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}


async function getAllTickets(req, res) {
  try {
     const connection = db.pool(); // mysql2/promise
    const [rows] = await connection.query('SELECT * FROM tickets ORDER BY created_at DESC');

    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching tickets:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}



async function resolveTicket(req, res) {
  const { license_key } = req.body;
  const resolved_by = req.email;

  if (!license_key) {
    return res.status(400).json({ success: false, message: 'License key is required' });
  }

  try {
    const connection = db.pool();

    // 1. Fetch license info
    const [licenseRows] = await connection.query(
      'SELECT * FROM licenses WHERE license_key = ?',
      [license_key]
    );

    if (licenseRows.length === 0) {
      return res.status(404).json({ success: false, message: 'License key not found.' });
    }

    const license = licenseRows[0];

    // 2. Clear device_id and update updated_at in licenses
    await connection.query(
      'UPDATE licenses SET device_id = NULL, updated_at = NOW() WHERE license_key = ?',
      [license_key]
    );

    // 3. Update tickets table
    await connection.query(
      'UPDATE tickets SET resolve_status = 1, resolved_by = ?, updated_at = NOW() WHERE license_key = ?',
      [resolved_by, license_key]
    );

    // 4. Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

   const htmlContent = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f3f4f6; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #1d4ed8; padding: 16px 24px; border-radius: 8px 8px 0 0; color: white;">
      <h2 style="margin: 0; font-size: 20px;">🎫 Ticket Resolution Confirmation</h2>
    </div>
    <div style="background-color: white; padding: 24px; border-radius: 0 0 8px 8px;">
      <p style="font-size: 16px; color: #111827; margin-bottom: 12px;">
        Hello <strong>${license.name}</strong>,
      </p>

      <p style="font-size: 15px; color: #374151; margin-bottom: 16px;">
        We’re reaching out to confirm that your support ticket related to the license key below has been successfully resolved:
      </p>

      <div style="background-color: #f0f9ff; padding: 12px 20px; border-left: 4px solid #2563eb; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 16px;"><strong>License Key:</strong> ${license.license_key}</p>
        <p style="margin: 0; font-size: 14px; color: #4b5563;"><strong>Email:</strong> ${license.assigned_to}</p>
        <p style="margin: 0; font-size: 14px; color: #4b5563;"><strong>Device ID:</strong> Cleared ✅</p>
      </div>

      <p style="font-size: 15px; color: #374151; margin-bottom: 16px;">
        As part of the resolution process, the associated device ID has been reset and the license is now ready to be reassigned or reactivated as needed.
      </p>

      <p style="font-size: 15px; color: #374151; margin-bottom: 16px;">
        If you encounter any further issues or require additional assistance, please don't hesitate to reach out. We're here to help!
      </p>

      <p style="font-size: 14px; color: #6b7280;">Resolved on: <strong>${new Date().toLocaleString()}</strong></p>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />

      <p style="font-size: 15px; color: #111827; margin-top: 20px;">
        Kind regards,<br/>
        <span style="color: #2563eb; font-weight: 600;">Practical Infosec Support Team</span><br/>
        <a href="https://practicalinfosec.com" style="color: #1d4ed8; text-decoration: none;">https://practicalinfosec.com</a>
      </p>
    </div>
  </div>
`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: license.assigned_to,
      subject: '🎫 Ticket Resolved - Practical Infosec',
      html: htmlContent
    });

    return res.json({ success: true, message: 'Ticket resolved and email sent.' });
  } catch (err) {
    console.error('Resolve Ticket Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

module.exports = {
    raiseTicket,
    getAllTickets,
    resolveTicket
}