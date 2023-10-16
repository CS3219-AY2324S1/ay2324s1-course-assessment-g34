require("dotenv").config();
const express = require('express');
const http = require('http');
const ShareDB = require('sharedb');
const WebSocket = require('ws');
const ShareDBMongo = require('sharedb-mongo');
const WebSocketJSONStream = require('websocket-json-stream');

const mongodbPort = 27017;
const sharedbPort = 8080;
const dbURL = process.env.DATABASE_URL || `mongodb://localhost:${mongodbPort}/collab-docs`;
const db = new ShareDB({ db: ShareDBMongo(dbURL) });
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws, req) => {
    const stream = new WebSocketJSONStream(ws);
    db.listen(stream);
});

server.listen(sharedbPort, () => {
    console.log(`Server started on http://localhost:${sharedbPort}`);
});
