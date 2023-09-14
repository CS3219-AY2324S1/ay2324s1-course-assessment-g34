const express = require("express");
const Question = require("../models/model");
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


//Post Method
router.post("/addQuestion", async (req, res) => {
    // res.send('Post API')
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

//Get all Method
router.get("/getAllQuestions", async (req, res) => {
    try {
        const data = await Question.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get by ID Method
router.get('/getQuestion/:id', async (req, res) => {
    try{
        const data = await Question.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
// sample postman query PATCH localhost:3000/api/updateQuestion/6502de2c3f85e1f959cc97c4 
// set body with question in json format to update any fields

//Update by ID Method
router.patch('/updateQuestion/:id', async (req, res) => {
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
router.delete("/deleteQuestion/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Question.findByIdAndDelete(id);
        res.send(`Document with ${data.title} has been deleted..`);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});