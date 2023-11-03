import React, { useEffect, useState } from 'react';
import { Container, Skeleton, Typography } from '@mui/material';
import axios from 'axios';
import Layout from '@/components/Layout';
import RouteGuard from '@/components/RouteGuard';
import { Role } from '@/utils/constants';
import ComponentGuard from '@/components/ComponentGuard';
import { useAuthContext } from '@/contexts/AuthContext';

export default function SubmissionHistory() {
  const { user } = useAuthContext();
  console.log(`User:`+user);

  const [submissions, setSubmissions] = useState([]);
  
  useEffect(() => {
    // Fetch the submission history when the component mounts
    const fetchSubmissionHistory = async () => {
      try {
        const response = await fetch('http://localhost:3001/submission-history/12345');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submission history:', error);
      }
    };

    fetchSubmissionHistory();
  }, []);

  return (
    <RouteGuard allowedRoles={[Role.USER, Role.ADMIN]}>
      <div>
        <h1>Submission History</h1>
        <table>
          <thead>
            <tr>
              <th style={{ border: '1px solid black' }}>Submission ID</th>
              <th style={{ border: '1px solid black' }}>Question ID</th>
              <th style={{ border: '1px solid black' }}>Time of Submission</th>
              <th style={{ border: '1px solid black' }}>Status</th>
              <th style={{ border: '1px solid black' }}>Runtime</th>
              <th style={{ border: '1px solid black' }}>Language</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.submission_id}>
                <td style={{ border: '1px solid black' }}>{submission.submission_id}</td>
                <td style={{ border: '1px solid black' }}>{submission.question_id}</td>
                <td style={{ border: '1px solid black' }}>{new Date(submission.time_of_submission).toLocaleString()}</td>
                <td style={{ border: '1px solid black' }}>{submission.status}</td>
                <td style={{ border: '1px solid black' }}>{submission.runtime}</td>
                <td style={{ border: '1px solid black' }}>{submission.language}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RouteGuard>
  );
};
