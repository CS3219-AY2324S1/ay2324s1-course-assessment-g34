const express = require("express");
const app = express();
const port = 8080; 
const codeExecutor = require("./codeExecutor");

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/execute-code", async (req, res) => {
  const userCode = req.body.code; // Get user code
  const timeoutMs = 10000;

  const timeout = setTimeout(() => {
    console.log("Code execution timed out after 10 seconds");
    res
      .status(500)
      .json({ error: "Code execution timed out after 10 seconds" });
  }, timeoutMs);

  try {
    const result = await codeExecutor(userCode);

    // Return the code execution result to the user
    res.json(result);
    clearTimeout(timeout);
    console.log("Code executed successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Code execution failed"});
  }
});
