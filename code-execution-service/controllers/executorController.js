// controllers/codeController.js
const executorModel = require("../models/executorModel");

const allowedLanguages = ["javascript", "python"]

async function executeCode(req, res) {
  const userCode = req.body.code;
  const language = req.body.language;
  const timeoutMs = 10000;

  if (!allowedLanguages.includes(language)) {
    return res.status(400).json({ error: "Code execution for this language is not supported" });
  }

  const executionPromise = executorModel.executeCodeInDocker(
    userCode,
    language
  );

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ error: "Code execution timed out after 10 seconds" });
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([executionPromise, timeoutPromise]);

    if (result.error) {
      // handles timeout error
      console.log(result.error);
      res.status(500).json({ error: result.error });
    } else {
      res.json(result);
      console.log("Code executed successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Code execution failed" });
  }
}

module.exports = {
  executeCode,
};
