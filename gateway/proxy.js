const dotenv = require('dotenv');

dotenv.config();

const httpProxy = require('http-proxy');
// const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = httpProxy.createProxyServer();

const USER_BASE_URL = process.env.USER_URL;
const QUESTION_BASE_URL = process.env.QUESTION_URL;
//const MATCHING_BASE_URL = process.env.MATCHING_URL;

const userProxy = (req, res) => {
  proxy.web(req, res, { target: USER_BASE_URL });
};

const questionProxy = (req, res) => {
    proxy.web(req, res, { target: QUESTION_BASE_URL });
  };

// const matchingWsProxy = createProxyMiddleware('/matching', {
//   target: MATCHING_BASE_URL,
//   ws: true,
// });

module.exports = {
  userProxy,
  questionProxy,
  //matchingProxy,
};