const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

function isAdmin(req, res, next) {
  // Pass through
  next();
}

module.exports = isAdmin;