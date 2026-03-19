const admin = require('../lib/firebase-admin');

/**
 * Middleware: verifies Firebase ID token and checks admin email.
 * Attach to any route that requires admin access.
 */
async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    // Only the designated admin email is allowed
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, error: 'Forbidden: not an admin account' });
    }

    req.adminUser = decoded;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

module.exports = { requireAdmin };
