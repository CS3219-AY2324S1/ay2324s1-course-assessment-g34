const { MatchEvent } = require("../constants/events");
const { findUserByCriteria, getMatchingQueueString, pushUserToQueue, removeUserFromQueue } = require("../utils/queueService");
const { createSession } = require("../utils/socket");
const { createMatchTimeout, clearMatchTimeout } = require("../utils/timeoutService");
const { formatUserData, generateSessionId } = require("../utils/utils");

const matchHandler = (socket) => {
  socket.on(MatchEvent.FIND, (data) => handleFindMatch(socket.id, data));
  socket.on(MatchEvent.CANCEL, () => handleCancelMatch(socket.id));
  socket.on(MatchEvent.DISCONNECT, () => handleDisconnect(socket.id));
};

const handleFindMatch = (userId, data) => {
  const user = formatUserData(userId, data);
  console.log(`User (id = ${userId}) trying to match with data:`, data);
  findMatch(user);
};

const handleCancelMatch = (userId) => {
  console.log(`User (id = ${userId}) cancelled matchmaking`)
  removeUserFromQueue(userId)
  clearMatchTimeout(userId);
};

const handleDisconnect = (userId) => {
  console.log(`User (id = ${userId}) has disconnected`);
  removeUserFromQueue(userId)
  clearMatchTimeout(userId);
};

const findMatch = (user) => {
  createMatchTimeout(user.id);
  const matchedUser = findUserByCriteria(user.criteria);

  if (matchedUser !== undefined) {
    const matchingQueueString = getMatchingQueueString()
    console.log(`Users in queue before match: ${matchingQueueString}`);

    const sessionId = generateSessionId();
  
    createSession(sessionId, user, matchedUser, user.criteria.difficulty);
    console.log("Ran createSession method in matchHandler")
    // handleCreateSession({ user1: user, user2: matchedUser, sessionId: sessionId, questionId: 'test' })
  } else {
    pushUserToQueue(user);
    console.log(`User (id = ${user.id}) pushed to match queue`)
    const matchingQueueString = getMatchingQueueString()
    console.log(`Users in queue: ${matchingQueueString}`);
  }
};

module.exports = matchHandler;
