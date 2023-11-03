// routes/routes.js
const express = require("express");
const isAdmin = require("../middlewares/authorizedMiddleware");
const router = express.Router();
const controller = require("../controllers/questionController");

// Public routes
router.get("/questions", controller.getAllQuestions);
// // Need to put these routes before `/questions/:id or "random" and "filter" will
// be counted as question ids and throw an ObjectId error
router.get("/questions/random", controller.getRandomQuestion);
router.get("/questions/filter", controller.filterQuestions);
router.get("/questions/:id", controller.getQuestionById);

// Private routes
router.post("/questions", isAdmin, controller.createQuestion);
router.patch("/questions/:id", isAdmin, controller.updateQuestion);
router.delete("/questions/:id", isAdmin, controller.deleteQuestion);

module.exports = router;
