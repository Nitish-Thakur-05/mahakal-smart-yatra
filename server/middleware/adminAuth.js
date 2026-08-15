const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./auth');

function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Authentication token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired authentication token. Please sign in again.' });
    }
    
    // Check if role is official/admin OR if email belongs to admin account
    const isOfficial = decoded.role === 'official' || 
                       decoded.role === 'admin' || 
                       (decoded.email && decoded.email.toLowerCase().includes('admin'));

    if (!isOfficial) {
      return res.status(403).json({ error: 'Access denied. Mahakal Administrator privileges required.' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = { requireAdmin };
