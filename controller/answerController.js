const { StatusCodes } = require('http-status-codes');
const dbConnection = require('../db/dbConfig');

// POST /api/answers/:questionid
const postAnswer = async (req, res) => {
  const { answer } = req.body;
  const { questionid } = req.params;
  const userid = req.user.userid;

  if (!answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Answer cannot be empty" });
  }

  try {
    await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
      [userid, questionid, answer]
    );
    res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.error("Error posting answer:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error posting answer" });
  }
};
// GET /api/answers/:questionid
const getAnswerByQuestion = async (req, res) => {
  const { questionid } = req.params;

  try {
    const [answers] = await dbConnection.query(
      `SELECT a.answerid, a.userid, a.questionid, a.answer, u.username
       FROM answers a
       JOIN users u ON a.userid = u.userid
       WHERE a.questionid = ?
       ORDER BY a.answerid DESC`,
      [questionid]
    );
    res.status(200).json(answers);
  } catch (error) {
    console.error("Error getting answers:", error.message);
    res.status(500).json({ msg: "Error getting answers" });
  }
};

// GET /api/answer/:answerid
const getAnswerById = async (req, res) => {
  const { answerid } = req.params;
  try {
    const [rows] = await dbConnection.query(
      `SELECT a.*, u.username 
       FROM answers a 
       JOIN users u ON a.userid = u.userid 
       WHERE a.answerid = ?`,
      [answerid]
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Answer not found" });
    }

    res.status(StatusCodes.OK).json(rows[0]); 
  } catch (error) {
    console.error("Error getting answer by ID:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error getting answer" });
  }
};


module.exports = {
  postAnswer,
  getAnswerByQuestion,
  getAnswerById
};
