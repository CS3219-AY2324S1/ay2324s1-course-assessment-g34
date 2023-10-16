const helmet = require('helmet');
const express = require("express");
const cors = require("cors");
const {
    authProxy,
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

app.use('/api/user-service/token', authProxy);

app.use(isAuthorized)

app.use('/api/user-service/token', authProxy);
app.use('/api/user-service/token', authProxy);

app.listen(3001, () => {
  console.log(`Server Started at ${3001}`);
});
