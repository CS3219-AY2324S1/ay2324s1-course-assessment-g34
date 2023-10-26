// models/codeModel.js
const { Docker } = require("node-docker-api");
const containerTypes = require("../config/containerConfig");
const secureProfiles = require("../config/containerConfig");

async function executeCodeInDocker(code, language) {
  const docker = new Docker();

  const containerConfig = containerTypes[language];

  const container = await docker.container.create({
    Image: containerConfig.image,
    Cmd: [containerConfig.cmd, containerConfig.cmdFlag, code],
    Tty: true,
    ...secureProfiles,
  });

  await container.start();

  const stream = await container.logs({
    follow: true,
    stdout: true,
    stderr: true,
  });

  let output = "";

  stream.on("data", (chunk) => {
    output += chunk.toString();
  });

  const { StatusCode } = await container.wait();

  await container.delete();

  return { output, exitCode: StatusCode };
}

module.exports = {
  executeCodeInDocker,
};
