import React, { useEffect, useState } from 'react';
import { Container, Skeleton, Typography } from '@mui/material';
import axios from 'axios';
import Layout from '@/components/Layout';
import RouteGuard from '@/components/RouteGuard';
import { Role } from '@/utils/constants';
import ComponentGuard from '@/components/ComponentGuard';
import { useAuthContext } from '@/contexts/AuthContext';

const submission_service_port = 5433;

export default function SubmissionHistory() {
  const { user } = useAuthContext();

  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (user == null)
      return;

    const fetchSubmissionHistory = async () => {
      try {
        console.log("Username: " + user.username);
        const response = await fetch(`http://localhost:${submission_service_port}/${user.username}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submission history:', error);
      }
    };
    
    fetchSubmissionHistory();
  }, [user]);

  return (
    <RouteGuard allowedRoles={[Role.USER, Role.ADMIN]}>
      <div>
        <h1>Submission History</h1>
        <table>
          <thead>
            <tr>
              <th style={{ border: '1px solid black' }}>Submission ID</th>
              <th style={{ border: '1px solid black' }}>Question ID</th>
              <th style={{ border: '1px solid black' }}>Submission Time</th>
              <th style={{ border: '1px solid black' }}>Outcome</th>
              <th style={{ border: '1px solid black' }}>Runtime</th>
              <th style={{ border: '1px solid black' }}>Language</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.submission_id}>
                <td style={{ border: '1px solid black' }}>{submission.submission_id}</td>
                <td style={{ border: '1px solid black' }}>{submission.question_id}</td>
                <td style={{ border: '1px solid black' }}>{submission.submission_time}</td>
                <td style={{ border: '1px solid black' }}>{submission.outcome}</td>
                <td style={{ border: '1px solid black' }}>{submission.runtime}</td>
                <td style={{ border: '1px solid black' }}>{submission.lang}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RouteGuard>
  );
};
