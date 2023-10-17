const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { v4: uuidv4 } = require("uuid");

const PORT = 8001;
const MATCHMAKING_TIMEOUT = 30000; // 30 seconds

const connectedUsers = [];
const matchingQueue = [];
const matchingTimeouts = {};

function isUserInQueue(userId) {
  return matchingQueue.some((entry) => entry.userId === userId);
}

function handleMatchingCancellation(userId) {
  if (isUserInQueue(userId)) {
    removeUserFromQueue(userId);
    // Cancel the timeout associated with the user
    if (matchingTimeouts[userId]) {
      clearTimeout(matchingTimeouts[userId]);
      delete matchingTimeouts[userId];
    }
    io.to(userId).emit("match-cancelled");
    console.log(`User ${userId} cancelled matchmaking.`);
  }
}

io.on("connection", (socket) => {
  console.log(`User ${socket.id} is connected`);

  // user data refers to chosen level of difficult and proficiency
  socket.on("start-matching", (userData) => {
    connectedUsers.push({ id: socket.id, ...userData });
    console.log(`User ${socket.id} trying to match with data:`, userData);
    tryMatchingUser(socket.id, userData);
  });

  socket.on("cancel-matching", () => {
    handleMatchingCancellation(socket.id);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} has disconnected`);
    const index = connectedUsers.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      connectedUsers.splice(index, 1);
    }
    removeUserFromQueue(socket.id);
  });
});

function tryMatchingUser(userId, userCriteria) {
  var result;
  const matchingUser = matchingQueue.findIndex((user) =>
    isMatch(user.criteria, userCriteria)
  );

  if (matchingUser !== -1) {
    const user2 = matchingQueue.splice(matchingUser, 1)[0];
    result = createMatch(userId, user2.userId);
  } else {
    matchingQueue.push({ userId, criteria: userCriteria });
  }
  // Timeout for matchmaking of current user
  const timeoutId = setTimeout(() => {
    handleMatchmakingTimeout(userId);
  }, MATCHMAKING_TIMEOUT);
  // Store the timeout ID associated with the user
  matchingTimeouts[userId] = timeoutId;
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

function createMatch(userId1, userId2) {
  const sessionId = generateUniqueSessionId();
  io.to(userId1).emit("match-found", { userId: userId2, sessionId: sessionId });
  io.to(userId2).emit("match-found", { userId: userId1, sessionId: sessionId });
  removeUserFromQueue(userId1);
  removeUserFromQueue(userId2);
  console.log(`Match found: ${userId1} and ${userId2}`);
}

function removeUserFromQueue(userId) {
  const index = matchingQueue.findIndex((entry) => entry.userId === userId);
  if (index !== -1) {
    matchingQueue.splice(index, 1);
  }
}

function handleMatchmakingTimeout(userId) {
  // Remove the user from the matching queue
  removeUserFromQueue(userId);

  if (matchingTimeouts[userId]) {
    clearTimeout(matchingTimeouts[userId]);
    delete matchingTimeouts[userId];
  }

  // Notify the user that matchmaking timed out
  io.to(userId).emit("match-timeout");

  console.log(`User ${userId} has timed out from matching.`);
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

http.listen(PORT, () => {
  console.log(`Matching Service Server is running on http://localhost:${PORT}`);
});
