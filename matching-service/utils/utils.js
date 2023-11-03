const { v4: uuidv4 } = require("uuid");

const formatUserData = (id, userData) => {
  return {
    id,
    username: userData.username,
    criteria: userData.criteria
  };
};

const generateSessionId = () => {
  // Generate a unique session ID 
  return "session_" + uuidv4();
};

module.exports = {
  formatUserData,
  generateSessionId,
};
