const crypto = require('crypto');

function generateLicenseKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segmentLength = 4;
  const numSegments = 4;

  return Array.from({ length: numSegments }, () =>
    Array.from(crypto.randomFillSync(new Uint8Array(segmentLength)))
      .map(byte => chars[byte % chars.length])
      .join('')
  ).join('-');
}


module.exports = {
    generateLicenseKey
}