const dotenv = require('dotenv');

dotenv.config();

const httpProxy = require('http-proxy');
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = httpProxy.createProxyServer();

const USER_BASE_URL = process.env.USER_BASE_URL;
const QUESTION_BASE_URL = process.env.QUESTION_BASE_URL;
//const MATCHING_BASE_URL = process.env.MATCHING_URL;

const userProxy = createProxyMiddleware({
  target: USER_BASE_URL,
  changeOrigin: true, // Required for the target server to receive the request
});

const questionProxy = createProxyMiddleware({
  target: QUESTION_BASE_URL,
  changeOrigin: true
});

module.exports = {
  userProxy,
  questionProxy,
  //matchingProxy,
};