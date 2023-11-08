const express = require("express");
const app = express();
const server = require("http").Server(app);
// const { v4: uuidv4 } = require("uuid");
// app.set("view engine", "ejs");
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
}

const PORT = process.env.PORT || 3002;

app.use("/peerjs", ExpressPeerServer(server, opinions));
// app.use(express.static("public"));

app.get("/", (req, res) => {
  // res.redirect(`/${uuidv4()}`);
  res.send("root path")
});

// app.get("/:room", (req, res) => {
//   res.render("room", { roomId: req.params.room });
// });

io.on("connection", (socket) => {
  socket.on(VideoEvent.JOIN, (data) => {
    const { sessionId, username } = data;
    socket.join(sessionId);
    console.log(`${socket.id} (${username}) join room ${sessionId}`);
    setTimeout(()=>{
      socket.to(sessionId).emit(VideoEvent.JOIN, {id: socket.id, username: username });
    }, 1000)
    // socket.on("message", (message) => {
    //   io.to(roomId).emit("createMessage", message, userName);
    // });
  });

  // CAN IGNORE MOST OF THESE; NOT IN USE FOR NOW
  socket.on(VideoEvent.REQUEST, (data) => {
    const { sessionId, username } = data;
    socket.to(sessionId).emit(VideoEvent.REQUEST, { userId: socket.id, username: username });
  });

  socket.on(VideoEvent.CANCEL, (data) => {
    const { sessionId } = data;
    socket.to(sessionId).emit(VideoEvent.CANCEL);
  });

  socket.on(VideoEvent.ACCEPT, (data) => {
    const { sessionId } = data;
    socket.to(sessionId).emit(VideoEvent.ACCEPT);
  });

  socket.on(VideoEvent.DECLINE, (data) => {
    const { sessionId } = data;
    socket.to(sessionId).emit(VideoEvent.DECLINE);
  });

  socket.on(VideoEvent.LEAVE, (data) => {
    const { sessionId } = data;
    console.log(`${socket.id} emitted leave event`)
    socket.to(sessionId).emit(VideoEvent.LEAVE);
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