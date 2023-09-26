const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
// const amqp = require("amqplib/callback_api");

const PORT = 3000;
// const AMQP_URL = "amqp://localhost";
const MATCHMAKING_TIMEOUT = 30000; // 30 seconds

const connectedUsers = [];
const matchingQueue = [];

function isUserInQueue(userId) {
  return matchingQueue.some((entry) => entry.userId === userId);
}

function handleMatchingCancellation(userId) {
  if (isUserInQueue(userId)) {
    removeUserFromQueue(userId);
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
  const matchingUser = matchingQueue.findIndex((user) =>
    isMatch(user.criteria, userCriteria)
  );

  if (matchingUser !== -1) {
    const user2 = matchingQueue.splice(matchingUser, 1)[0];
    createMatch(userId, user2.userId);
  } else {
    matchingQueue.push({ userId, criteria: userCriteria });
  }

  // Timeout for matchmaking of current user
  setTimeout(() => {
    handleMatchmakingTimeout(userId);
  }, MATCHMAKING_TIMEOUT);
}

function isMatch(criteria1, criteria2) {
  return (
    criteria1.difficulty === criteria2.difficulty &&
    criteria1.proficiency === criteria2.proficiency
  );
}

function createMatch(userId1, userId2) {
  io.to(userId1).emit("match-found", { userId: userId2 });
  io.to(userId2).emit("match-found", { userId: userId1 });
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

// RabbitMQ setup
// function startServer() {
//     amqp.connect(AMQP_URL, (error0, connection) => {
//     if (error0) {
//         throw error0;
//     }

//     connection.createChannel((error1, channel) => {
//         if (error1) {
//         throw error1;
//         }

//         const exchange = "matchmaking-exchange";
//         const queueName = "matchmaking-queue";

//         channel.assertExchange(exchange, "direct", { durable: false });
//         channel.assertQueue(queueName, { exclusive: false });

//         channel.bindQueue(queueName, exchange, "");

//         channel.consume(
//         queueName,
//         (msg) => {
//             const message = JSON.parse(msg.content.toString());

//             // Check if the message is a match cancellation request
//             if (message.type === "cancel-match") {
//             // Forward the cancellation request to the user's specific queue
//             const userQueueName = `/user/${message.userId}/queue/matchmaking`;
//             channel.sendToQueue(
//                 userQueueName,
//                 Buffer.from(JSON.stringify(message))
//             );
//             console.log(`Sent cancel-match message to user ${message.userId}`);
//             }
//         },
//         {
//             noAck: true,
//         }
//         );
//     });
//     });
// }
// startServer();
