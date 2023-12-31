// models/codeModel.js
const { Docker } = require("node-docker-api");
const { containerTypes, secureProfiles } = require("../config/containerConfig");

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

function isSafeUserCode(userCode) {
  // Regular expressions to match unsafe patterns
  const unsafePatterns = [
    /(require\(['"]fs['"]\))|(\bfs\.[a-zA-Z_]+\b)/, // Filesystem access
    /(require\(['"]net['"]\))|(\bnet\.[a-zA-Z_]+\b)/, // Network access
    /(process\.|(function\w+\s*\(.*\)\s*{)|\bexec\b)/, // Signals and syscalls
  ];

  for (const pattern of unsafePatterns) {
    if (pattern.test(userCode)) {
      return false; // Unsafe code found
    }
  }

  return true; // Code is safe
}

module.exports = {
  executeCodeInDocker, 
  isSafeUserCode
};
