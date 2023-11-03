const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const service_port = 5433;
const sql_port = 5432;

const app = express();
const pool = new Pool({
    user: 'postgres-db',
    host: 'postgres-db',
    database: 'history-service',
    password: 'postgres-db',
    port: `${sql_port}`,
});

// Middlewares
app.use(cors());
app.use(express.json());

// Function to insert a new submission
/** @returns the newly inserted row.*/
const make_submission = async (questionId, runtime, username, outcome, lang, content) => {
    const text = 'INSERT INTO submissions (questionId, runtime, username, outcome, lang, content) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [questionId, runtime, username, outcome, lang, content];

    try {
        const res = await pool.query(text, values);
        return res.rows[0];
    } catch (err) {
        throw err;
    }
};

// Endpoint to get submission history for a user
app.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const result = await pool.query('SELECT * FROM submissions WHERE username = $1', [username]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start the server
app.listen(service_port, () => {
    console.log(`Server running on port ${service_port}`);
});


// testing code
const readline = require('readline');
const RL = readline.createInterface({
    input: process.stdin
});

RL.on('line', (line) => {
    const args = line.split(' ');
    if (args.length != 6) {
        console.log(`Need 6 args, got ${args.length}`);
        return;
    }
    const questionId = parseInt(args[0]);
    if (isNaN(questionId) || !Number.isInteger(questionId)) {
        console.log(`"${questionId}" is not an integer.`);
        return;
    }
    const runtime = parseInt(args[1]);
    if (isNaN(runtime) || !Number.isInteger(runtime)) {
        console.log(`"${runtime}" is not an integer.`);
        return;
    }
    make_submission(questionId, runtime, args[2], args[3], args[4], args[5])
        .then(submission => {
            console.log('Submission successful:', submission);
        })
        .catch(error => {
            console.error('Submission failed:', error);
        });
});