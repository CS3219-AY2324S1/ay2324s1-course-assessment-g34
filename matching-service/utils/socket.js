const { io: clientIo } = require("socket.io-client");
const { Server } = require("socket.io");
const { SessionEvent } = require("../constants/events");

const COLLAB_SVC_URI = process.env.COLLAB_SVC_URI || 'ws://localhost:8080';

var io;
var collabSocket;

const onConnection = (socket, eventHandler) => {
  console.log(`User (id = ${socket.id}) is connected`);
  eventHandler(socket);
}

const connect = (http, eventHandler) => {
  io = new Server(http, {
    path: "/api/matching-service/socket.io",
    cors: {
      origin: "*"
    }
  });

  io.on('connection', (socket) => onConnection(socket, eventHandler));
}

const connectCollabSocket = (eventHandler) => {
  collabSocket = clientIo(COLLAB_SVC_URI, {
    path: "/api/collab-service/socket.io" 
  });

  console.log("connect to collab socket");
  eventHandler(collabSocket);
};

const createSession = (sessionId, user1, user2, difficulty) => {
  console.log(`Create session event for ${user1.id} and ${user2.id}`)
  collabSocket.emit(SessionEvent.CREATE, { sessionId, user1, user2, difficulty });
};

const sendDataToUser = (socketId, eventKey, data) => {
  io.to(socketId).emit(eventKey, data);
}

module.exports = {
  connect,
  connectCollabSocket,
  createSession,
  sendDataToUser
};
