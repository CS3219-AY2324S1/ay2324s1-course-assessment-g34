// Update utils/constants.js in frontend if this is modified
const MatchEvent = {
  FIND: "find-match",
  FOUND: "match-found",
  CANCEL: "cancel-match",
  CANCELLED: "match-cancelled",
  TIMEOUT: "match-timeout", // match not found
  DISCONNECT: "disconnect"
};

module.exports = { MatchEvent };
