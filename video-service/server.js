const express = require("express");
const http = require("http");
const { ExpressPeerServer } = require("peer");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: '/api/video-service/socket.io',
  cors: {
    origin: '*'
  }
});

const { VideoEvent } = require("./constants/events");

const PORT = process.env.PORT || 3002;
const PEER_SERVER_PORT = process.env.PEER_SERVER_PORT || 3003;

// PeerJS server setup
const peerApp = express();
const peerServer = http.createServer(peerApp);
const peerOpinions = {
  debug: true,
  proxied: true,
};
peerApp.use("/peerjs", ExpressPeerServer(peerServer, peerOpinions));

// Test route for main server
app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Hello' });
});

io.on("connection", (socket) => {
  socket.on(VideoEvent.JOIN, (data) => {
    const { sessionId, username, peerId } = data;
    socket.join(sessionId);
    console.log(`${socket.id} (${username}) joined room ${sessionId}`);

    setTimeout(()=>{
      socket.to(sessionId).emit(VideoEvent.JOIN, { username, peerId });
    }, 1000)
  });

  socket.on(VideoEvent.TOGGLE_MIC, (data) => {
    const { sessionId, isMicOn } = data;
    socket.to(sessionId).emit(VideoEvent.TOGGLE_MIC, { isMicOn });
  });

  socket.on(VideoEvent.TOGGLE_CAM, (data) => {
    const { sessionId, isVideoOn } = data;
    socket.to(sessionId).emit(VideoEvent.TOGGLE_CAM, { isVideoOn });
  });

  socket.on(VideoEvent.DISCONNECTING, () => {
    socket.rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        console.log(roomId);
        io.to(roomId).emit(VideoEvent.LEAVE);
      }
    })
  });
});

server.listen(PORT, () => {
    console.log(`Video Service Server is running on http://localhost:${PORT}`);
});

peerServer.listen(PEER_SERVER_PORT, () => {
  console.log(`PeerJS Server is running on http://localhost:${PEER_SERVER_PORT}`);
});