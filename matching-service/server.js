require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});
const { MatchEvent } = require("./constants/events");

const PORT = process.env.PORT || 8001;
const MATCHMAKING_TIMEOUT = 30000; // 30 seconds

const connectedUsers = [];
const matchingQueue = [];
const matchingTimeouts = {};

function isUserInQueue(userId) {
  return matchingQueue.some((entry) => entry.userId === userId);
}

function handleMatchingCancellation(userId) {
  if (isUserInQueue(userId)) {
    console.log(`removing user ${userId} from queue`)
    removeUserFromQueue(userId);

    // Cancel the timeout associated with the user
    if (matchingTimeouts[userId]) {
      clearTimeout(matchingTimeouts[userId]);
      delete matchingTimeouts[userId];
      console.log("clear timeout")
    }
    io.to(userId).emit(MatchEvent.CANCELLED);
    console.log(`User (id = ${userId}) cancelled matchmaking.`);
  }
}

io.on("connection", (socket) => {
  console.log(`User (id = ${socket.id}) is connected`);

  // user data refers to chosen level of difficult and proficiency
  socket.on(MatchEvent.FIND, (userData) => {
    connectedUsers.push({ id: socket.id, ...userData });
    console.log(`User (id = ${socket.id}) trying to match with data:`, userData);
    tryMatchingUser(socket.id, userData);
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

function tryMatchingUser(userId, userData) {
  var result;
  const matchingUser = matchingQueue.findIndex((user) =>
    isMatch(user.criteria, userData)
  );

  if (matchingUser !== -1) {
    console.log(`Users in queue before match: ${JSON.stringify(matchingQueue, null, 2)}`);
    const user2 = matchingQueue.splice(matchingUser, 1)[0];
    result = createMatch({ id: userId, username: userData.username }, { id: user2.userId, username: user2.criteria.username });
  } else {
    matchingQueue.push({ userId, criteria: userData });
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

function createMatch(user1, user2) {
  // Cancel the timeout associated with the user
  if (matchingTimeouts[user1.id] && matchingTimeouts[user2.id]) {
    clearTimeout(matchingTimeouts[user1.id]);
    clearTimeout(matchingTimeouts[user2.id]);
    delete matchingTimeouts[user1.id];
    delete matchingTimeouts[user2.id];
    console.log("clear timeout of matched users")
  }

  // required to show log message indicating status of queue before and after match
  io.to(user1.id).emit(MatchEvent.FOUND, { username: user2.username });
  io.to(user2.id).emit(MatchEvent.FOUND, { username: user1.username });
  removeUserFromQueue(user1.id);
  removeUserFromQueue(user2.id);
  console.log(`Match found: ${user1.username} (id = ${user1.id}) and ${user2.username} (id = ${user2.id})`);
  console.log(`Users in queue after match: ${JSON.stringify(matchingQueue, null, 2)}`);
}

function removeUserFromQueue(userId) {
  const index = matchingQueue.findIndex((entry) => entry.userId === userId);
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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

http.listen(PORT, () => {
  console.log(`Matching Service Server is running on http://localhost:${PORT}`);
});
