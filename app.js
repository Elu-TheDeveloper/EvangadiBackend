const express = require('express');
const app = express();
const port = 7700;
const cors = require('cors');
app.use(cors());

// Database connection
const dbConnection = require('./db/dbConfig');

// Routers
const userRouter = require('./routes/userRouter');
const questionRoutes = require('./routes/questionRoute');
const answerRoutes = require('./routes/answersRouter');

// Auth middleware
const authMiddleware = require('./middleware/authenticationMiddleware');

// JSON middleware
app.use(express.json());

// Route middlewares
app.use('/api/users', userRouter);
app.use('/api/questions', authMiddleware, questionRoutes);
app.use('/api/answers', answerRoutes);

// Start the server
async function DBstart() {
    try {
        const value = await dbConnection.execute("SELECT 'test' AS result");

        app.listen(port, () => {
            console.log(" Database connection established");
            console.log(`Server is listening on http://localhost:${port}`);
        });

        console.log("DB Response:", value);
    } catch (error) {
        console.error("Startup error:", error.message || error);
    }
}

DBstart();
