const express = require("express");
const Question = require("../models/model");
const isAdmin = require('../middlewares/authorizedMiddleware');
// const QuestionDescription = require("../models/model");

const router = express.Router();

module.exports = router;

// const newQuestion = new Question({
//     title: "Sample Question",
//     categories: ["Math", "Algebra"],
//     complexity: "Medium",
//     link: "https://example.com/questions/1",
//     description: "example only"
// });

//Public route accessible without authentication

//Get all questions sorted by title in ascending order
router.get("/questions", async (req, res) => {
    try {
        const data = await Question.find().sort({title: 1});
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get by ID Method
router.get('/questions/:id', async (req, res) => {
    try{
        const data = await Question.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get random question by complexity and category
// http://localhost:3000/api/random?complexity=<complexity>&categories=<categories>
router.get('/random', async (req, res) => {
    const { complexity, categories } = req.query;
    
    // Filter questions based on complexity and category
    // can be empty for both
    // params are case sensitive
    const filter = {};
    if (complexity) {
        filter.complexity = complexity;
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
});

// filter by choice
router.get("/filter", async (req, res) => {
  const { categories, complexity } = req.query;

  // can be empty for any
  // params are case sensitive
    const filter = {};
    if (categories) {
        filter.categories = categories;
    }
    if (complexity) {
        filter.complexity = complexity;
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
});

//Private route accessible by only the admins

//Post Method
router.post("/questions", isAdmin, async (req, res) => {

    const { title, categories, complexity, link, description } = req.body;

    // Create a new question
    const newQuestion = new Question({ title, categories, complexity, link, description });

    try {
        const dataToSave = await newQuestion.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// sample postman query PATCH localhost:3000/question-service/questions/6502de2c3f85e1f959cc97c4 
// set body with question in json format to update any fields

//Update by ID Method
router.patch('/questions/:id', isAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Question.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete("/questions/:id", isAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Question.findByIdAndDelete(id);
        res.send(`Document with ${data.title} has been deleted..`);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});