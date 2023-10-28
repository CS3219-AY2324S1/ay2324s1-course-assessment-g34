// Update utils/constants.js in frontend if this is modified
const MatchEvent = {
  FIND: 'find-match',
  FOUND: 'match-found',
  CANCEL: 'cancel-match',
  TIMEOUT: 'match-timeout', // match not found
  DISCONNECT: 'disconnect'
};

const SessionEvent = {
  CREATE:'create-session',
  ERROR: 'session-error'
};

module.exports = { MatchEvent, SessionEvent };
