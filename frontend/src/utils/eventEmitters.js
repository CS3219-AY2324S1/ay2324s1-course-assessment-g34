import { MatchEvent } from "./constants";
import { formatMatchSocketData } from "./socketUtils";

export const findMatch = (socket, username, complexity, proficiency) => {
  const data = formatMatchSocketData(username, complexity, proficiency);
  socket.emit(MatchEvent.FIND, data);
};

export const cancelMatch = (socket, username) => {
  socket.emit(MatchEvent.CANCEL, { username });
}

export const disconnect = (socket, username) => {
  socket.emit(MatchEvent.DISCONNECT, { username });
}