import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import RouteGuard from '@/components/RouteGuard';
import { Role } from '@/utils/constants';
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
        const response = await fetch(`http://localhost:${submission_service_port}/user/${user.username}`);
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
              <th style={{ border: '1px solid black' }}>Question ID</th>
              <th style={{ border: '1px solid black' }}>Submission Time</th>
              <th style={{ border: '1px solid black' }}>Language</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.submission_id}>
                <td style={{ border: '1px solid black' }}>{submission.question_id}</td>
                <td style={{ border: '1px solid black' }}>
                  <Link href={`/submission/${submission.submission_id}`}>{submission.submission_time}</Link>
                </td>
                <td style={{ border: '1px solid black' }}>{submission.lang}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RouteGuard>
  );
};
