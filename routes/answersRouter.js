const express = require('express');
const router = express.Router();
const { postAnswer, getAnswerByQuestion, getAnswerById } = require('../controller/answerController');
const authMiddleware = require('../middleware/authenticationMiddleware');

// get a single Answer
router.get('/single/:answerid', getAnswerById);

// POST Answer 
router.post('/:questionid', authMiddleware, postAnswer);

// GET all answers for question
router.get('/:questionid', getAnswerByQuestion);

module.exports = router;
