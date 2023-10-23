const { Docker } = require("node-docker-api");
const express = require("express");
const app = express();
const port = 3000; // Choose a suitable port number

app.use(express.json());

// Define your `executeCodeInDockerContainer` function here

async function executeCodeInDockerContainer(code) {
  const docker = new Docker();

  // Create a Docker container using a base image
  const container = await docker.container.create({
    Image: "node:14", // Use an appropriate image (e.g., Node.js)
    Cmd: ["node", "-e", code], // Use 'node' to execute JavaScript code directly
    Tty: true, // Allocate a pseudo-TTY for interaction
  });

  // Start the Docker container
  await container.start();

  // Capture the container's output
  const stream = await container.logs({
    follow: true, // Stream the logs
    stdout: true, // Capture standard output
    stderr: true, // Capture standard error
  });

  let output = "";

  // Process the output
  stream.on("data", (chunk) => {
    output += chunk.toString();
  });

  // Wait for the container to exit
  const { StatusCode } = await container.wait();

  // Stop and remove the container
//   await container.stop();
  await container.delete();

  return { output, exitCode: StatusCode };
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/execute-code", async (req, res) => {
  const userCode = req.body.code; // Get user-submitted code

  try {
    const result = await executeCodeInDockerContainer(userCode);

    // Return the code execution result to the user
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Code execution failed"});
  }
});
