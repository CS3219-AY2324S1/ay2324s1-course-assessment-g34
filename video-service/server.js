const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  path: '/api/video-service/socket.io',
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const { VideoEvent } = require("./constants/events");
const opinions = {
  debug: true,
  proxied: true,
}

const PORT = process.env.PORT || 3002;

// Test route
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Hello',
  });
});

app.use("/peerjs", ExpressPeerServer(server, opinions));

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