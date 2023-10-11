export const formatMatchSocketData = (username, complexity, proficiency) => {
  return { username, complexity, proficiency };
}

export const getComplexity = (msg) => {
  return msg.complexity;
}

export const getProficiency = (msg) => {
  return msg.proficiency;
}