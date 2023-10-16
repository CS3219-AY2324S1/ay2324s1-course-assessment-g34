const dotenv = require('dotenv');

dotenv.config();

const httpProxy = require('http-proxy');
// const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = httpProxy.createProxyServer();

const AUTH_BASE_URL = process.env.AUTH_URL;
const USER_BASE_URL = process.env.USER_URL;
const QUESTION_BASE_URL = process.env.QUESTION_URL;
//const MATCHING_BASE_URL = process.env.MATCHING_URL;

const authProxy = (req, res) => {
  proxy.web(req, res, { target: AUTH_BASE_URL });
};

const userProxy = (req, res) => {
  proxy.web(req, res, { target: HISTORY_BASE_URL });
};

const questionProxy = (req, res) => {
    proxy.web(req, res, { target: VIDEO_BASE_URL });
  };

// const matchingWsProxy = createProxyMiddleware('/matching', {
//   target: MATCHING_BASE_URL,
//   ws: true,
// });

module.exports = {
  authProxy,
  userProxy,
  questionProxy,
  //matchingProxy,
};