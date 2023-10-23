const { Docker } = require("node-docker-api");

async function codeExecutor(code) {
  const docker = new Docker();

  // Create a Docker container using a base image
  const container = await docker.container.create({
    Image: "node:14", // Use an appropriate image (e.g., Node.js)
    Cmd: ["node", "-e", code], // Use 'node' to execute JavaScript code directly
    Tty: true, // Allocate a pseudo-TTY for interaction
  });

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

  // Delete the container
  await container.delete();

  return { output, exitCode: StatusCode };
}

module.exports = codeExecutor;