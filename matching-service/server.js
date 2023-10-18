require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});
const { MatchEvent } = require("./constants/events");
const { formatUserData } = require("./utils/utils");

const PORT = process.env.PORT || 8001;
const MATCHMAKING_TIMEOUT = 30000; // 30 seconds

const connectedUsers = [];
const matchingQueue = [];
const matchingTimeouts = {};

function isUserInQueue(userId) {
  return matchingQueue.some((entry) => entry.id === userId);
}

function handleMatchingCancellation(userId) {
  if (isUserInQueue(userId)) {
    removeUserFromQueue(userId);
  }

  // Cancel the timeout associated with the user
  if (matchingTimeouts[userId]) {
    clearTimeout(matchingTimeouts[userId]);
    delete matchingTimeouts[userId];
  }

  io.to(userId).emit(MatchEvent.CANCELLED);
  console.log(`User (id = ${userId}) cancelled matchmaking.`);
}

io.on("connection", (socket) => {
  console.log(`User (id = ${socket.id}) is connected`);

  // user data refers to chosen level of difficult and proficiency
  socket.on(MatchEvent.FIND, (userData) => {
    const user = formatUserData(socket.id, userData);
    connectedUsers.push(user);
    console.log(`User (id = ${socket.id}) trying to match with data:`, userData);
    tryMatchingUser(user);
  });

  socket.on(MatchEvent.CANCEL, () => {
    console.log(`${socket.id} cancelled matchmaking`)
    handleMatchingCancellation(socket.id);
  });

  socket.on(MatchEvent.DISCONNECT, () => {
    console.log(`User (id = ${socket.id}) has disconnected`);
    const index = connectedUsers.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      connectedUsers.splice(index, 1);
    }
    removeUserFromQueue(socket.id);
  });
});

function tryMatchingUser(user) {
  var result;
  const matchedUserIndex = matchingQueue.findIndex((userInQueue) =>
    isMatch(userInQueue.criteria, user.criteria)
  );

  if (matchedUserIndex !== -1) {
    console.log(`Users in queue before match: ${JSON.stringify(matchingQueue, null, 2)}`);
    const matchedUser = matchingQueue.splice(matchedUserIndex, 1)[0];
    result = createMatch(user, matchedUser);
  } else {
    matchingQueue.push(user);
  }
  // Timeout for matchmaking of current user
  const timeoutId = setTimeout(() => {
    handleMatchmakingTimeout(user.id);
  }, MATCHMAKING_TIMEOUT);
  // Store the timeout ID associated with the user
  matchingTimeouts[user.id] = timeoutId;
  return result;
}

function isMatch(criteria1, criteria2) {
  return (
    criteria1.difficulty === criteria2.difficulty &&
    criteria1.proficiency === criteria2.proficiency
  );
}

function generateUniqueSessionId() {
  // Generate a unique session ID 
  return "session_" + uuidv4();
}

function createMatch(user1, user2) {
  // Cancel the timeout associated with the user
  if (matchingTimeouts[user1.id] && matchingTimeouts[user2.id]) {
    clearTimeout(matchingTimeouts[user1.id]);
    clearTimeout(matchingTimeouts[user2.id]);
    delete matchingTimeouts[user1.id];
    delete matchingTimeouts[user2.id];
  }

  const sessionId = generateUniqueSessionId();
  // required to show log message indicating status of queue before and after match
  io.to(user1.id).emit(MatchEvent.FOUND, { username: user2.username, sessionId: sessionId });
  io.to(user2.id).emit(MatchEvent.FOUND, { username: user1.username, sessionId: sessionId });
  removeUserFromQueue(user1.id);
  removeUserFromQueue(user2.id);
  console.log(`Match found: ${user1.username} (id = ${user1.id}) and ${user2.username} (id = ${user2.id} with session id = ${sessionId})`);
  console.log(`Users in queue after match: ${JSON.stringify(matchingQueue, null, 2)}`);
}

function removeUserFromQueue(userId) {
  const index = matchingQueue.findIndex((entry) => entry.id === userId);
  if (index !== -1) {
    matchingQueue.splice(index, 1);
  }
}

function handleMatchmakingTimeout(userId) {
  if (matchingTimeouts[userId]) {
    console.log(`${userId} is in match timeouts`)
    // Remove the user from the matching queue
    removeUserFromQueue(userId);
    clearTimeout(matchingTimeouts[userId]);
    delete matchingTimeouts[userId];

    // Notify the user that matchmaking timed out
    io.to(userId).emit(MatchEvent.TIMEOUT);
    console.log(`Client (id = ${userId}) has timed out from matching.`);
  }
}

// TODO: remove once matching service is stable
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

http.listen(PORT, () => {
  console.log(`Matching Service Server is running on http://localhost:${PORT}`);
});
