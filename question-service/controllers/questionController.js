// questionController.js
const questionService = require("../services/questionService");

// Public routes
exports.getAllQuestions = async (req, res) => {
  try {
    const data = await questionService.getAllQuestionsService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const data = await questionService.getQuestionByIdService(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRandomQuestion = async (req, res) => {
  const { difficulty, categories } = req.query;

  try {
    const filteredQuestions = await questionService.filterQuestionsService(
      difficulty,
      categories
    );

    if (filteredQuestions.length === 0) {
      return res
        .status(200)
        .json({ message: "No questions found with the specified criteria" });
    }
    // Select a random question from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    res.json(filteredQuestions[randomIndex]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching random question" });
  }
};

exports.filterQuestions = async (req, res) => {
  const { categories, difficulty } = req.query;

  try {
    const filteredQuestions = await questionService.filterQuestionsService(
      categories,
      difficulty
    );

    if (filteredQuestions.length === 0) {
      return res
        .status(200)
        .json({ message: "No questions found with the specified criteria" });
    }

    res.json(filteredQuestions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching filtered questions" });
  }
};

// Private routes
exports.createQuestion = async (req, res) => {
  const { title, categories, difficulty, link, description } = req.body;

  try {
    const dataToSave = await questionService.createQuestionService(
      title,
      categories,
      difficulty,
      link,
      description
    );
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const result = await questionService.updateQuestionService(id, updatedData);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await questionService.deleteQuestionService(id);
    res.send(`Document with ${data.title} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
