const { Server } = require("socket.io");

var io;

const onConnection = (socket, eventHandler) => {
  console.log(`User (id = ${socket.id}) is connected`);
  eventHandler(io, socket);
}

const connect = (server, eventHandler) => {
  io = new Server(server, {
    path: "/api/collab-service/socket.io",
    cors: {
        origin: "*"
    }
  });

  console.log("set up collab service socket... ")
  io.on('connection', (socket) => onConnection(socket, eventHandler));
}

const sendData = (socketId, eventKey, data) => {
  io.to(socketId).emit(eventKey, data);
}

module.exports = {
  connect,
  sendData
};
