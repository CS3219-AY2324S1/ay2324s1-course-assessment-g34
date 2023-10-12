export const formatMatchSocketData = (username, complexity, proficiency) => {
  return { username, complexity, proficiency };
}

export const getUsername = (msg) => {
  return msg.username;
}

export const getComplexity = (msg) => {
  return msg.complexity;
}

export const getProficiency = (msg) => {
  return msg.proficiency;
}