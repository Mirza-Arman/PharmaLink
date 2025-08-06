const jwt = require('jsonwebtoken');

module.exports = (type) => (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== type) return res.status(403).json({ message: 'Forbidden' });
    req.user = { id: decoded.id, type: decoded.type };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 