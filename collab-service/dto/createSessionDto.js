class CreateSessionDto {
  user1;

  user2;

  sessionId;

  questionId;

  constructor(user1, user2, sessionId, questionId) {
    this.user1 = user1;
    this.user2 = user2;
    this.sessionId = sessionId;
    this.questionId = questionId;
  }
}

module.exports = CreateSessionDto;
