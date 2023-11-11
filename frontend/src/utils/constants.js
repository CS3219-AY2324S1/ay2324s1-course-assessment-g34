export const NAVBAR_HEIGHT_PX = 64;

export const Role = {
  ADMIN: 'admin',
  USER: 'normal user',
};

// Update utils/events.js in matching-service if this is modified
export const MatchEvent = {
  FIND: 'find-match',
  FOUND: 'match-found',
  CANCEL: 'cancel-match',
  TIMEOUT: 'match-timeout', // match not found
};

export const MATCH_TIMEOUT_DURATION = 30;

export const SessionEvent = {
  CREATE: 'create-session',
  JOIN: 'join-session',
  ERROR: 'session-error',
  FETCH_QUESTION: 'fetch_question-session',
  ENDED: 'session-ended',
  QUESTION_FETCHED: 'session-question_fetched',
};

export const Language = {
  PYTHON: 'Python',
  JAVASCRIPT: 'JavaScript',
  CPP: 'C++',
  JAVA: 'Java',
  TYPESCRIPT: 'TypeScript',
};
