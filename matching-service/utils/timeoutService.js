const { MatchEvent } = require("../constants/events");
const { removeUserFromQueue } = require("./queueService");
const { sendDataToUser } = require("./socket");

const matchingTimeouts = {};
const MATCHMAKING_TIMEOUT = 30000; // 30 seconds

const createMatchTimeout = (userId) => {
  const timeoutId = setTimeout(() => handleMatchTimeout(userId), MATCHMAKING_TIMEOUT);
  matchingTimeouts[userId] = timeoutId;
};

const clearMatchTimeout = (userId) => {
  if (matchingTimeouts[userId]) {
    clearTimeout(matchingTimeouts[userId]);
    delete matchingTimeouts[userId];
  }
};

const getMatchTimeout = (userId) => {
  return matchingTimeouts[userId];
}

const handleMatchTimeout = (userId) => {
  if (getMatchTimeout(userId)) {
    removeUserFromQueue(userId);
    clearMatchTimeout(userId);
    sendDataToUser(userId, MatchEvent.TIMEOUT, {});
    console.log(`Client (id = ${userId}) has timed out from matching.`);
  }
};

module.exports = {
  createMatchTimeout,
  clearMatchTimeout,
  getMatchTimeout
};