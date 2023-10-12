export const Role = {
  ADMIN: 'admin',
  USER: 'normal user',
};

// Update utils/events.js in matching-service if this is modified
export const MatchEvent = {
  FIND: "find-match",
  FOUND: "match-found",
  CANCEL: "cancel-match",
  CANCELLED: "match-cancelled",
  TIMEOUT: "match-timeout", // match not found
  DISCONNECT: "disconnect",
};
