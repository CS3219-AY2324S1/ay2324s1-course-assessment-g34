// controllers/controller.js
const Question = require("../models/model");

// Public routes
exports.getAllQuestions = async (req, res) => {
  try {
    const data = await Question.find().sort({ title: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const data = await Question.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRandomQuestion = async (req, res) => {
  const { difficulty, categories } = req.query;

  // Filter questions based on difficulty and category
  // can be empty for both
  // params are case sensitive
  const filter = {};
  if (difficulty) {
    filter.difficulty = difficulty;
  }
  if (categories) {
    filter.categories = categories;
  }

  try {
    // Use your Mongoose model to query the database
    const filteredQuestions = await Question.find(filter);

    // Check if any questions match the criteria
    if (filteredQuestions.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found with the specified criteria" });
    }

    // Select a random question from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const randomQuestion = filteredQuestions[randomIndex];

    res.json(randomQuestion);
  } catch (error) {
    res.status(500).json({ error: "Error fetching random question" });
  }
};

exports.filterQuestions = async (req, res) => {
  const { categories, difficulty } = req.query;

  // can be empty for any
  // params are case sensitive
  const filter = {};
  if (categories) {
    filter.categories = categories;
  }
  if (difficulty) {
    filter.difficulty = difficulty;
  }

  try {
    // Use your Mongoose model to query the database
    const filteredQuestions = await Question.find(filter);

    // Check if any questions match the criteria
    if (filteredQuestions.length === 0) {
      return res
        .status(200)
        .json({ message: "No questions found with the specified criteria" });
    }

    res.json(filteredQuestions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching random question" });
  }
};

// Private routes
exports.createQuestion = async (req, res) => {
  const { title, categories, difficulty, link, description } = req.body;
  const newQuestion = new Question({
    title,
    categories,
    difficulty,
    link,
    description,
  });

  try {
    const dataToSave = await newQuestion.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Question.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Question.findByIdAndDelete(id);
    res.send(`Document with ${data.title} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
