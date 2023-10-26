const express = require("express");
const app = express();
const port = 8008;
const codeRoutes = require("./routes/routes");

app.use(express.json());
app.use("/api", codeRoutes); 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
