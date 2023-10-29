const { SessionEvent, MatchEvent } = require("../constants/events");
const { getMatchingQueueString, pushUserToQueue, removeUserFromQueue } = require("../utils/queueService");
const { sendDataToUser } = require("../utils/socket");
const { clearMatchTimeout } = require("../utils/timeoutService");

const sessionHandler = (socket) => {
  // listening to clientSocket
  socket.on(SessionEvent.CREATE, handleCreateSession);
  socket.on(SessionEvent.ERROR, handleCreateSessionError);
};

const handleCreateSession = (data) => {
  const { user1, user2, sessionId, questionId } = data;

  removeUserFromQueue(user1.id)
  clearMatchTimeout(user1.id);
  removeUserFromQueue(user2.id)
  clearMatchTimeout(user2.id);

  // emit session details to 2 users
  sendDataToUser(user1.id, MatchEvent.FOUND, { username: user2.username, sessionId, questionId });
  sendDataToUser(user2.id, MatchEvent.FOUND, { username: user1.username, sessionId, questionId });

  console.log(`Match found: ${user1.username} (id = ${user1.id}) and ${user2.username} (id = ${user2.id} with session id = ${sessionId})`);
  
  const matchingQueueString = getMatchingQueueString();
  console.log(`Users in queue after match: ${matchingQueueString}`);
};

const handleCreateSessionError = (data) => {
  const { sessionId, user1, user2, difficulty, error } = data;
  console.log("handling create session error", data);
  pushUserToQueue(user1);
  console.log("pushed to queue: ", user1);
};

module.exports = {
  sessionHandler,
  handleCreateSession // remove later
};