// routes/routes.js
const express = require("express");
const isAdmin = require("../middlewares/authorizedMiddleware");
const router = express.Router();
const controller = require("../controllers/questionController");

// Public routes
router.get("/questions", controller.getAllQuestions);
router.get("/questions/:id", controller.getQuestionById);
router.get("/random", controller.getRandomQuestion);
router.get("/filter", controller.filterQuestions);

// Private routes
router.post("/questions", isAdmin, controller.createQuestion);
router.patch("/questions/:id", isAdmin, controller.updateQuestion);
router.delete("/questions/:id", isAdmin, controller.deleteQuestion);

module.exports = router;
