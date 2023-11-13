const dotenv = require('dotenv');

dotenv.config();

const httpProxy = require('http-proxy');
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = httpProxy.createProxyServer();

const USER_BASE_URL = process.env.USER_BASE_URL;
const QUESTION_BASE_URL = process.env.QUESTION_BASE_URL;
const MATCHING_BASE_URL = process.env.MATCHING_BASE_URL;
const COLLAB_BASE_IO_URL = process.env.COLLAB_BASE_IO_URL;
const COLLAB_BASE_WS_URL = process.env.COLLAB_BASE_WS_URL;
const VIDEO_BASE_URL = process.env.VIDEO_BASE_URL;
const EXECUTION_BASE_URL = process.env.EXECUTION_BASE_URL;

const userProxy = createProxyMiddleware({
  target: USER_BASE_URL,
  changeOrigin: true, // Required for the target server to receive the request
});

const questionProxy = createProxyMiddleware({
  target: QUESTION_BASE_URL,
  changeOrigin: true
});

const executionProxy = createProxyMiddleware({
  target: EXECUTION_BASE_URL,
  changeOrigin: true
});

const matchingProxy = createProxyMiddleware(
  '/api/matching-service/socket.io', {
    target: MATCHING_BASE_URL,
    changeOrigin: true,
    ws: true
  }
);

const collabProxyIO = createProxyMiddleware(
  '/api/collab-service/socket.io', {
    target: COLLAB_BASE_IO_URL,
    changeOrigin: true,
    ws: true
  }
);

const collabProxyWS = createProxyMiddleware(
  '/api/collab-service/ws', {
    target: COLLAB_BASE_WS_URL,
    changeOrigin: true,
    ws: true
  }
);

const videoProxy = createProxyMiddleware(
  '/api/video-service/socket.io', {
    target: VIDEO_BASE_URL,
    changeOrigin: true,
    ws: true
  }
);

const peerJSProxy = createProxyMiddleware(
  '/peerjs', {
    target: VIDEO_BASE_URL,
    changeOrigin: true,
    ws: true
  }
);


module.exports = {
  userProxy,
  questionProxy,
  executionProxy,
  matchingProxy,
  collabProxyIO,
  collabProxyWS,
  videoProxy,
  peerJSProxy
};