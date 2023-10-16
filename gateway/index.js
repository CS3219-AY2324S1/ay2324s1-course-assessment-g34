const helmet = require('helmet');
const express = require("express");
const cors = require("cors");
const {
    userProxy,
    questionProxy
} = require('./proxy');

const app = express();

const isAuthorized = require('./middlewares/authMiddleware');

// Configure CORS for requests from http://localhost:3000
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

// Test route
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Hello',
  });
});

// filter out user-service endpoints
app.use('/api/user-service', userProxy);

app.use(isAuthorized)

// allows only authorized user to access these endpoints
app.use('/api/question-service', questionProxy);

app.listen(3001, () => {
  console.log(`Server Started at ${3001}`);
});
