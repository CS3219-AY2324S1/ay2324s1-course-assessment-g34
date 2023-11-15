import { MatchEvent, SessionEvent, VideoEvent } from './constants';
import { formatMatchSocketData } from './socketUtils';

// Matching
export const findMatch = (socket, username, difficulty, proficiency) => {
  const data = formatMatchSocketData(username, difficulty, proficiency);
  socket.emit(MatchEvent.FIND, data);
};

export const cancelMatch = (socket) => {
  socket.emit(MatchEvent.CANCEL);
};

// Collab sessions
export const joinSession = (socket, sessionId) => {
  socket.emit(SessionEvent.JOIN, { sessionId });
};

export const fetchSessionQuestion = (socket, sessionId, difficulty) => {
  socket.emit(SessionEvent.FETCH_QUESTION, { sessionId, difficulty });
};

// Video call
export const joinVideoRoom = (socket, sessionId, username, peerId) => {
  socket.emit(VideoEvent.JOIN, { sessionId, username, peerId });
};

export const toggleMic = (socket, sessionId, isMicOn) => {
  socket.emit(VideoEvent.TOGGLE_MIC, { sessionId, isMicOn });
};

export const toggleVideo = (socket, sessionId, isVideoOn) => {
  socket.emit(VideoEvent.TOGGLE_CAM, { sessionId, isVideoOn });
};
