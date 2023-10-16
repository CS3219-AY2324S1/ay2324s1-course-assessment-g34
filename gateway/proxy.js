const dotenv = require('dotenv');

dotenv.config();

const httpProxy = require('http-proxy');
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = httpProxy.createProxyServer();

const USER_BASE_URL = process.env.USER_BASE_URL;
const QUESTION_BASE_URL = process.env.QUESTION_BASE_URL;
//const MATCHING_BASE_URL = process.env.MATCHING_URL;

const userProxy = createProxyMiddleware('/api/user-service', {
  target: USER_BASE_URL
});

const questionProxy = createProxyMiddleware('/api/question-service', {
  target: QUESTION_BASE_URL
});

module.exports = {
  userProxy,
  questionProxy,
  //matchingProxy,
};