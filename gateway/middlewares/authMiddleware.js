const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

function isAuthorized(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token not provided or in the wrong format' });
  }

  // Extract the token (remove "Bearer " prefix)
  const token = authorizationHeader.replace('Bearer ', '').trim();

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      // Token is valid; proceed to the next middleware or route handler
      next();
    }
  });
}

module.exports = isAuthorized;