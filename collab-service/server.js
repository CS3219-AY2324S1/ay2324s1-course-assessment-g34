require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const sharedbPort = 8080;
const app = express();
const server = http.createServer(app);

const shareDBSocketServer = new WebSocket.Server({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  console.log('req url: ', req.url);
  if (!req.url.startsWith('/api/collab-service/socket.io')) {
    console.log('upgrade to shareDBSocketServer');
    shareDBSocketServer.handleUpgrade(req, socket, head, (ws) => {
      shareDBSocketServer.emit('connection', ws, req);
    });
  }
});

const { initializeShareDbStream } = require('./utils/dbUtils');
const { connect } = require('./utils/socket');
const sessionHandler = require('./eventHandlers/sessionHandler');

const onShareDbConnection = (ws) => {
  initializeShareDbStream(ws);
};

shareDBSocketServer.on('connection', onShareDbConnection);

connect(server, sessionHandler);

server.listen(sharedbPort, () => {
  console.log(`Server started on http://localhost:${sharedbPort}`);
});
