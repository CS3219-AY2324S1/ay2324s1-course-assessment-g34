const matchingQueue = [];

function pushUserToQueue(user) {
  return matchingQueue.push(user);
};

function getUserByIndexFromQueue(index) {
  return matchingQueue[index];
}

function removeUserFromQueue(userId) {
  const index = matchingQueue.findIndex((entry) => entry.id === userId);
  if (index !== -1) {
    return matchingQueue.splice(index, 1);
  }
}

function isUserInQueue(userId) {
  return matchingQueue.some((entry) => entry.id === userId);
};

function findUserByCriteria(criteria) {
  console.log(criteria);
  return matchingQueue.find((user) => isMatch(user.criteria, criteria));
};

function isMatch(criteria1, criteria2) {
  return (
    criteria1.difficulty === criteria2.difficulty &&
    criteria1.proficiency === criteria2.proficiency
  );
}

// for logging purposes
function getMatchingQueueString() {
  return JSON.stringify(matchingQueue, null, 2);
}

module.exports = {
  pushUserToQueue,
  getUserByIndexFromQueue,
  removeUserFromQueue,
  isUserInQueue,
  findUserByCriteria,
  getMatchingQueueString
};
