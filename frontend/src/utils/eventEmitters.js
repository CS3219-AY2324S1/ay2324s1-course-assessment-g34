import { MatchEvent } from './constants';
import { formatMatchSocketData } from './socketUtils';

export const findMatch = (socket, username, complexity, proficiency) => {
  const data = formatMatchSocketData(username, complexity, proficiency);
  socket.emit(MatchEvent.FIND, data);
};

export const cancelMatch = (socket) => {
  socket.emit(MatchEvent.CANCEL);
};

export const disconnectMatch = (socket) => {
  socket.disconnect();
};
