// questionService.js
const Question = require("../models/model");

exports.getAllQuestionsService = async () => {
  return Question.find().sort({ title: 1 });
};

exports.getQuestionByIdService = async (id) => {
  return Question.findById(id);
};

exports.filterQuestionsService = async (categories, difficulty) => {
  const filter = {};
  if (difficulty) {
    filter.difficulty = difficulty;
  }
  if (categories) {
    filter.categories = categories;
  }

  return Question.find(filter);
};

exports.createQuestionService = async (
  title,
  categories,
  difficulty,
  link,
  description
) => {
  const newQuestion = new Question({
    title,
    categories,
    difficulty,
    link,
    description,
  });
  return newQuestion.save();
};

exports.updateQuestionService = async (id, updatedData) => {
  const options = { new: true };
  return Question.findByIdAndUpdate(id, updatedData, options);
};

exports.deleteQuestionService = async (id) => {
  return Question.findByIdAndDelete(id);
};
