const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_pentru_dev';

/**
 * Middleware pentru verificare token JWT
 * Atașează informațiile user-ului la req.user
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: "Token lipsă - Autentificare necesară" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalid sau expirat" });
    }
    
    req.user = user; // { id, email, rolId }
    next();
  });
}

module.exports = { authenticateToken };