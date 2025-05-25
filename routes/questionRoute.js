const express = require('express');
const router = express.Router();

const { askQuestion, getAllQuestions } = require('../controller/questionController');

// POST /api/questions/ask
router.post('/ask', askQuestion);

// GET /api/questions/all-questions
router.get('/all-questions', getAllQuestions);

module.exports = router;