require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http").createServer(app);

const PORT = process.env.PORT || 8001;

const {  connect, connectCollabSocket } = require("./utils/socket");
const matchHandler = require('./eventHandlers/matchHandler');
const { sessionHandler } = require("./eventHandlers/sessionHandler");

connect(http, matchHandler);
connectCollabSocket(sessionHandler);

// TODO: remove once matching service is stable
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

http.listen(PORT, () => {
  console.log(`Matching Service Server is running on http://localhost:${PORT}`);
});
