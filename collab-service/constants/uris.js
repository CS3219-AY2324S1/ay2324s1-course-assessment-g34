const QUESTION_SVC_URI = process.env.QUESTION_SVC_URI || 'http://localhost:5000';
const QUESTION_SVC_PREFIX = '/api/question-service';

const GET_RANDOM_QUESTION = '/questions/random';

const GET_RANDOM_QUESTION_SVC_URI = QUESTION_SVC_URI + QUESTION_SVC_PREFIX + GET_RANDOM_QUESTION;

module.exports = {
  GET_RANDOM_QUESTION_SVC_URI,
};
