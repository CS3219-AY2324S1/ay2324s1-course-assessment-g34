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

module.exports = containerTypes;
