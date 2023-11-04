const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const service_port = 5433;
const sql_port = 5432;

const app = express();
const pool = new Pool({
    user: 'postgres-db',
    host: 'postgres-db9000',
    database: 'submission-db',
    password: 'postgres-db',
    port: `${sql_port}`,
});

// Middlewares
app.use(cors());
app.use(express.json());

// Function to insert a new submission
/** @returns the newly inserted row.*/
const make_submission = async (questionId, runtime, username, outcome, lang, code) => {
    const text = 'INSERT INTO submissions (questionId, runtime, username, outcome, lang, code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [questionId, runtime, username, outcome, lang, code];

    try {
        const res = await pool.query(text, values);
        return res.rows[0];
    } catch (err) {
        throw err;
    }
};

// Get submission history of a user
app.get('/user/:username', async (req, res) => {
    try {
        const text = 'SELECT submission_id, question_id, runtime, submission_time, outcome, lang FROM submissions WHERE username = $1';
        const { username } = req.params;
        const result = await pool.query(text, [username]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get details of a specific submission
app.get('/submission/:id', async (req, res) => {
    try {
        const text = 'SELECT question_id, runtime, submission_time, outcome, lang, code FROM submissions WHERE submission_id = $1';
        const { id } = req.params;
        const result = await pool.query(text, [id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start the server
app.listen(service_port, () => {
    console.log(`Submission service running on port ${service_port}`);
});