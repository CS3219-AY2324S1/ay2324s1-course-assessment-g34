const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

function isAdmin(req, res, next) {

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decoded;
    });

    const userRole = req.user.user_role;
  
    if (userRole === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied: Admin role required.' });
    }
}

module.exports = isAdmin;