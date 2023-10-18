const formatUserData = (id, userData) => {
  return {
    id,
    username: userData.username,
    criteria: userData.criteria
  };
};

module.exports = { formatUserData };
