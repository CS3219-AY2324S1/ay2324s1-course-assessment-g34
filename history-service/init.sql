CREATE TABLE submissions (
	submission_id SERIAL PRIMARY KEY,
	question_id CHAR(24),
	submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	username1 TEXT,
	username2 TEXT,
	lang TEXT,
	code TEXT
);
CREATE INDEX idx_username1 ON submissions (username1);
CREATE INDEX idx_username2 ON submissions (username2);