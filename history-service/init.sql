CREATE TABLE submissions (
	submission_id SERIAL PRIMARY KEY,
	question_id INT NOT NULL,
	runtime INT NOT NULL,
	submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	username TEXT,
	outcome TEXT,
	lang TEXT,
	code TEXT
);
CREATE INDEX idx_submissions_user_id ON submissions (username);

