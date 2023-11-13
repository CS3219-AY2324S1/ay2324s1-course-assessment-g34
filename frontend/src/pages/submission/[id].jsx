import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Paper, Typography, TextField } from '@mui/material';

const submission_service_port = 5433;

export default function SubmissionPage() {
  const router = useRouter();
  // Get the dynamic part of the URL
  const { id } = router.query;

  const [submission, setSubmission] = useState([]);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        console.log("Submission ID: " + id);
        const response = await fetch(`http://localhost:${submission_service_port}/submission/${id}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSubmission(data);
      } catch (error) {
        console.error('Error fetching submission details:', error);
      }
    };
    fetchSubmissionDetails();
  }, [id]);

  return (
    <Paper elevation={0} style={{ padding: '20px' }}>
      <Typography variant="h5" component="h3" style={{ marginBottom: '20px' }}>
        Submission Details
      </Typography>
      <Typography variant="body1"><strong>Question ID:</strong> {submission.question_id}</Typography>
      <Typography variant="body1"><strong>Submission Time:</strong> {submission.submission_time}</Typography>
      <Typography variant="body1"><strong>Language:</strong> {submission.lang}</Typography>
      <Typography variant="body1"><strong>Code:</strong></Typography>
      <TextField
        fullWidth
        multiline
        variant="outlined"
        rows={20}
        value={submission.code}
        InputProps={{
          readOnly: true,
        }}
      />
    </Paper>
  );
};

