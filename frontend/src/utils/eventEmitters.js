import { MatchEvent, SessionEvent, VideoEvent } from './constants';
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

// Video call
export const joinVideoRoom = (socket, sessionId, username) => {
  socket.emit(VideoEvent.JOIN, { sessionId, username });
};

export const requestCall = (socket, sessionId, username) => {
  socket.emit(VideoEvent.REQUEST, { sessionId, username });
};

export const cancelCall = (socket, sessionId) => {
  socket.emit(VideoEvent.CANCEL, { sessionId });
};

export const acceptCall = (socket, sessionId) => {
  socket.emit(VideoEvent.ACCEPT, { sessionId });
};

export const declineCall = (socket, sessionId) => {
  socket.emit(VideoEvent.DECLINE, { sessionId });
};

export const endCall = (socket, sessionId) => {
  socket.emit(VideoEvent.LEAVE, { sessionId });
  console.log("Emit end call event")
};
