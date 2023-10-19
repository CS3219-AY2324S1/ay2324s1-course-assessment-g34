import React, { useEffect, useState } from 'react';
import { Container, Skeleton, Typography } from '@mui/material';
import axios from 'axios';
import Layout from '@/components/Layout';
import QuestionTable from '@/components/QuestionPage/QuestionTable';
import { GET_ALL_QUESTIONS_SVC_URI } from '@/config/uris';
import AddQuestion from '@/components/QuestionPage/AddQuestion';
import RouteGuard from '@/components/RouteGuard';
import { Role } from '@/utils/constants';
import ComponentGuard from '@/components/ComponentGuard';
import EditQuestion from '@/components/QuestionPage/EditQuestion';
import { useAuthContext } from '@/contexts/AuthContext';

/**
 * QuestionPage component for displaying and managing questions.
 *
 * @component
 * @example
 * // Usage within another React component
 * import QuestionPage from './QuestionPage';
 * // ...
 * <QuestionPage />
 *
 * @returns {JSX.Element} The rendered QuestionPage component.
 */
export default function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { getAccessToken } = useAuthContext();
  const [selectedQuestion, setSelectedQuestion] = useState({
    _id: '',
    title: '',
    description: '',
    categories: [],
    link: '',
    difficulty: 'Easy',
  });

  const getAllQuestions = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(GET_ALL_QUESTIONS_SVC_URI, config);
      setQuestions(response.data);
    } catch (err) {
      console.error('An error occurred:', err);
      setError('An error occurred while retrieving the questions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllQuestions();
  }, []);

  return (
    <RouteGuard allowedRoles={[Role.USER, Role.ADMIN]}>
      <Layout>
        <Container
          maxWidth="xl"
          sx={{ height: '100vh', my: 2 }}
        >
          <Typography
            variant="h5"
            noWrap
            component="h5"
            color="primary"
            sx={{
              marginTop: 0,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '30px',
            }}
          >
            Questions
          </Typography>
          <ComponentGuard allowedRoles={[Role.ADMIN]}>
            <AddQuestion setQuestions={setQuestions} />
            <EditQuestion
              setQuestions={setQuestions}
              question={selectedQuestion}
              isOpen={isEditModalOpen}
              setIsOpen={setIsEditModalOpen}
            />
          </ComponentGuard>
          {error
              && (
              <Typography color="error" sx={{ textAlign: 'center' }} variant="h6">
                {error}
              </Typography>
              )}
          {isLoading
            ? <Skeleton variant="rectangular" height="50vh" />
            : (
              <QuestionTable
                questions={questions}
                setQuestions={setQuestions}
                setError={setError}
                setSelectedQuestion={setSelectedQuestion}
                setIsEditModalOpen={setIsEditModalOpen}
              />
            )}
        </Container>
      </Layout>
    </RouteGuard>
  );
}
