import { MatchEvent } from './constants';
import { formatMatchSocketData } from './socketUtils';

export const findMatch = (socket, username, difficulty, proficiency) => {
  const data = formatMatchSocketData(username, difficulty, proficiency);
  socket.emit(MatchEvent.FIND, data);
};

export const cancelMatch = (socket) => {
  socket.emit(MatchEvent.CANCEL);
};

export const disconnectMatch = (socket) => {
  socket.disconnect();
};
