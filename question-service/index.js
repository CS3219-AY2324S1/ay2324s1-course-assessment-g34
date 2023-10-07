require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;
const routes = require("./routes/routes");
const cors = require("cors");

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
const app = express();

app.use(express.json());

// Configure CORS for requests from http://localhost:3000
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
app.use('/question-service', routes);

app.listen(5000, () => {
  console.log(`Server Started at ${5000}`);
});
