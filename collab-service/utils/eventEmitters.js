const { sendData } = require('./socket');
const { SessionEvent } = require('../constants/events');

const emitCreateSessionEvent = (socketId, data) => {
  sendData(socketId, SessionEvent.CREATE, data);
};

const emitSessionErrorEvent = (socketId, data, error) => {
  sendData(socketId, SessionEvent.ERROR, { ...data, error });
};

const emitJoinSessionEvent = (sessionId) => {
  sendData(sessionId, SessionEvent.JOIN, {});
};

const emitQuestionFetchedEvent = (sessionId, questionId) => {
  sendData(sessionId, SessionEvent.QUESTION_FETCHED, { questionId });
};

const emitFetchQuestionEvent = (sessionId) => {
  sendData(sessionId, SessionEvent.FETCH_QUESTION);
};

const emitSessionEndedEvent = (sessionId) => {
  sendData(sessionId, SessionEvent.ENDED, {});
};

module.exports = {
  emitCreateSessionEvent,
  emitSessionErrorEvent,
  emitJoinSessionEvent,
  emitQuestionFetchedEvent,
  emitFetchQuestionEvent,
  emitSessionEndedEvent,
};
