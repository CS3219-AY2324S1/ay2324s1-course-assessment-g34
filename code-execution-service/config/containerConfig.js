// config/containerTypes.js
const containerTypes = {
  python: {
    image: "python:3.9",
    cmd: "python",
    cmdFlag: "-c",
    ext: "py",
  },
  javascript: {
    image: "node:14",
    cmd: "node",
    cmdFlag: "-e",
    ext: "js",
  },
};

const secureProfiles = {
  HostConfig: {
    SecurityOpt: [
      // Seccomp profiles to restrict system calls (customize this profile)
      "seccomp=unconfined",
    ],
    // Add resource limits and other security configurations
    Resources: {
      Memory: 256000000, // Limit memory to 256MB
      PidsLimit: 32, // Limit the number of processes
      cpu: 0.1
    },
    CapDrop: [
      "ALL", // Drop all Linux capabilities
      "SETFCAP",
      "MKNOD",
    ],
    ReadonlyRootfs: true, // Mount the root file system as read-only
    NetworkMode: "none", // Isolate the container from the network
    IpcMode: "private", // Isolate inter-process communication
    Ulimits: [
      // Configure ulimits for the container
      {
        Name: "nofile",
        Soft: 1024,
        Hard: 2048,
      },
    ],
    // Add more security configurations as required
  },
};

module.exports = { containerTypes, secureProfiles };
