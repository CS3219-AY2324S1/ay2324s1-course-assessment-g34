import { MatchEvent, SessionEvent } from './constants';
import { formatMatchSocketData } from './socketUtils';

export const findMatch = (socket, username, difficulty, proficiency) => {
  const data = formatMatchSocketData(username, difficulty, proficiency);
  socket.emit(MatchEvent.FIND, data);
};

export const cancelMatch = (socket) => {
  socket.emit(MatchEvent.CANCEL);
};

export const joinSession = (socket, sessionId) => {
  socket.emit(SessionEvent.JOIN, { sessionId });
};

export const fetchSessionQuestion = (socket, sessionId, difficulty) => {
  socket.emit(SessionEvent.FETCH_QUESTION, { sessionId, difficulty });
};
