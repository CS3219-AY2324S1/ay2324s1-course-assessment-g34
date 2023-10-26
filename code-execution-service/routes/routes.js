// routes/codeRoutes.js
const express = require("express");
const router = express.Router();
const executorController = require("../controllers/executorController");

router.post("/execute-code", executorController.executeCode);

module.exports = router;
