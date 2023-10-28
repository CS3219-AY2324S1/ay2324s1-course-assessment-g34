const { SessionEvent } = require("../constants/events");  
const { getRandomQuestionId } = require("../utils/api");
const CreateSessionDto = require("../dto/createSessionDto");
const { createDocument, deleteDocument } = require("../utils/dbUtils");
const { emitSessionErrorEvent, emitCreateSessionEvent, emitJoinSessionEvent, emitFetchQuestionEvent, emitQuestionFetchedEvent, emitSessionEndedEvent } = require("../utils/eventEmitters");

const sessionHandler = (io, socket) => {
  socket.on(SessionEvent.CREATE, (data) => handleCreateSession(data, socket));
  socket.on(SessionEvent.JOIN, (data) => handleJoinSession(data, socket));
  socket.on(SessionEvent.FETCH_QUESTION, handleFetchQuestion);
  socket.on(SessionEvent.DISCONNECTING, () => handleDisconnect(io, socket));
};

const handleCreateSession = async (data, socket) => {
  const { sessionId, user1, user2, difficulty } = data;
  console.log(`Attempting to create session for ${sessionId}`)

  if (!sessionId || !user1 || !user2 || !difficulty) {
    const error = "Invalid data."
   
    emitSessionErrorEvent(socket.id, data, error);
    return;
  }

  const questionId = await getRandomQuestionId(difficulty, socket.id, data);

  if (!questionId) {
    return;
  }

  const docId = await createDocument(sessionId); // docId == sessionId
  console.log("doc id:", docId);

  if (!docId) {
    const error = "Error creating document.";
    emitSessionErrorEvent(socket.id, data, error);
    return;
  }

  const sessionData = new CreateSessionDto(user1, user2, sessionId, questionId);

  emitCreateSessionEvent(socket.id, sessionData);
  console.log("emit create session event with data: ", sessionData);
}

const handleJoinSession = async (data, socket) => {
  const { sessionId } = data;

  if (!sessionId) {
    // handle invalid data here
    const error = "No session ID provided.";
    emitSessionErrorEvent(socket.id, data, error);
    return;
  }

  socket.join(sessionId);

  console.log(`Client (id = ${socket.id}) joined room [roomId = ${sessionId}].`);

  emitJoinSessionEvent(sessionId);
}

const handleFetchQuestion = async (data) => {
  const { sessionId, difficulty } = data;

  if (!sessionId || !difficulty) {
    const error = "Invalid data."
   
    emitSessionErrorEvent(sessionId, data, error);
    return;
  }
  
  // emit event to room to notify users that someone has already fetched question
  emitFetchQuestionEvent(sessionId);

  const questionId = await getRandomQuestionId(difficulty, sessionId);

  if (!questionId) {
    return;
  }

  emitQuestionFetchedEvent(sessionId, questionId);
}

const handleDisconnect = async (io, socket) => {
  // notify other users in room that a user has disconnected
  console.log(socket.rooms);

  socket.rooms.forEach((roomId) => {
    const clientCount = io.sockets.adapter.rooms.get(roomId).size;

    if (roomId !== socket.id){
      console.log(roomId);
      emitSessionEndedEvent(roomId);
      console.log("emitted session ended event to: ", roomId)
    }
    
    if (roomId !== socket.id && clientCount === 1) {
      deleteDocument(roomId)
    }
  });
}

module.exports = sessionHandler;
