const axios = require('axios');
const { GET_RANDOM_QUESTION_SVC_URI } = require('../constants/uris');
const { emitSessionErrorEvent } = require('./eventEmitters');

const getRandomQuestionId = async (difficulty, matchSocketId, matchData) => {
  const config = {
    params: { difficulty }
  };

  try {
    const response = await axios.get(GET_RANDOM_QUESTION_SVC_URI, config);
    return response.data._id;
  } catch (err) {
    if (err.response && err.response.status == 404) {
      const message = `No questions found with the difficulty: ${difficulty}`;
      console.error(message);
      emitSessionErrorEvent(matchSocketId, matchData, message);
    } else {
      console.error(err);
      const message = "Something went wrong when retrieving the question";
      emitSessionErrorEvent(matchSocketId, matchData, message);
    }
  }
}

module.exports = {
  getRandomQuestionId
};
