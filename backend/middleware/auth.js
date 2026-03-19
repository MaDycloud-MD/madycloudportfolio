const admin = require('../lib/firebase-admin');

function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || '';
  return raw
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token   = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const adminEmails = getAdminEmails();
    if (adminEmails.length === 0) {
      return res.status(500).json({ success: false, error: 'ADMIN_EMAILS not configured on server' });
    }

    if (!adminEmails.includes(decoded.email?.toLowerCase())) {
      return res.status(403).json({
        success: false,
        error: `${decoded.email} is not an authorized admin`,
      });
    }

    req.adminUser = decoded;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

module.exports = { requireAdmin };