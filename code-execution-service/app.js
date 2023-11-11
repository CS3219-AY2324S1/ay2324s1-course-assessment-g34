const express = require("express");
const app = express();
const port = 8008;
const codeRoutes = require("./routes/routes");
const cors = require("cors");

app.use(express.json());
const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));
app.use("/api/code-execution-service", codeRoutes); 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
