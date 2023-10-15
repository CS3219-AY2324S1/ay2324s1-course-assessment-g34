export const formatMatchSocketData = (username, difficulty, proficiency) => (
  { username, criteria: { difficulty, proficiency } }
);

export const getUsername = (msg) => msg.username;

export const getDifficulty = (msg) => msg.difficulty;

export const getProficiency = (msg) => msg.proficiency;
