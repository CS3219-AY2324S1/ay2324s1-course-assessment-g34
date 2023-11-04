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
        // TODO explicit handle of empty result.rows
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Insert a new submission
app.post('/submission', async (req) => {
    const queryJson = req.body;
    console.log(`Received ${queryJson}`);
    const text = 'INSERT INTO submissions (question_id, runtime, username, outcome, lang, code) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [queryJson.question_id, queryJson.runtime, queryJson.username, queryJson.outcome, queryJson.lang, queryJson.code];
    try {
        await pool.query(text, values);
    } catch (err) {
        throw err;
    }
});

// Start the server
app.listen(service_port, () => {
    console.log(`Submission service running on port ${service_port}`);
});