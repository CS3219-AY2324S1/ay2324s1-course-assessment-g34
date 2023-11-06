const SessionEvent = {
  CREATE: 'create-session',
  JOIN: 'join-session',
  ERROR: 'session-error',
  FETCH_QUESTION: 'fetch_question-session',
  ENDED: 'session-ended',
  QUESTION_FETCHED: 'session-question_fetched',
  DISCONNECTING: 'disconnecting',
};

module.exports = { SessionEvent };
