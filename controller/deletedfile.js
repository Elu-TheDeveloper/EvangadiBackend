const express = require('express');
const { StatusCodes } = require('http-status-codes')
const dbConnection = require('../db/dbConfig');
const router = express.Router();
// POST /api/questions/ask
async function askQuestion(req, res) {
    const { title, description, tag } = req.body;
    const userid = req.user.userid;
  
    if (!title || !description || !tag) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "All fields are required" });
    }
  
    const questionid = `q-${Math.random().toString(36).slice(2)}`;
  
    try {
      await dbConnection.query(
        "INSERT INTO questions (questionid, userid, title, description, tag) VALUES (?, ?, ?, ?, ?)",
        [questionid, userid, title, description, tag]
      );
      res.status(StatusCodes.CREATED).json({ msg: "Question posted successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error posting question" });
    }
  }
  
  // GET /api/questions/all-questions
  async function getAllQuestions(req, res) {
    try {
      const [questions] = await dbConnection.query(
        "SELECT q.*, u.username FROM questions q JOIN users u ON q.userid = u.userid ORDER BY q.id DESC"
      );
      res.status(StatusCodes.OK).json(questions);
    } catch (error) {
      console.log(error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error fetching questions" });
    }
  }
  
  module.exports = { askQuestion, getAllQuestions };