const helmet = require('helmet');
const express = require("express");
const cors = require("cors");

const {
    userProxy,
    questionProxy,
    matchingProxy,
    collabProxyIO,
    collabProxyWS,
    videoProxy,
    peerJSProxy,
    executionProxy
} = require('./proxy');

const app = express();

const isAuthenticated = require('./authMiddleware');

// Configure CORS for requests from anywhere
const corsOptions = {
  origin: '*', // TODO: Update accordingly
  credentials: true
};

app.use(cors(corsOptions));
// app.use(helmet());

// Test route
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Hello',
  });
});

// filter out user-service endpoints
app.use('/api/user-service', (req, res) => {
  userProxy(req, res);
});

app.use(matchingProxy);

app.use(collabProxyIO);

app.use(collabProxyWS);

app.use(videoProxy);

app.use(peerJSProxy);

app.use(isAuthenticated);

// allows only authorized user to access these endpoints
app.use('/api/question-service', (req, res) => {
  questionProxy(req, res);
})

app.use('/api/code-execution-service', (req, res) => {
  executionProxy(req, res);
})

app.listen(3001, () => {
  console.log(`Server Started at ${3001}`);
});