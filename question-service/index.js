require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;
const routes = require("./routes/questionRoutes");
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

const corsOptions = {
  origin: '*',
  credentials: true
};

app.use(cors(corsOptions));
app.use('/api/question-service', routes);

app.listen(5000, () => {
  console.log(`Server Started at ${5000}`);
});
