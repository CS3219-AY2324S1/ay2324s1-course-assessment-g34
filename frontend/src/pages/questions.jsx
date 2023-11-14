import React, { useCallback, useEffect, useState } from 'react';
import { Container, Skeleton, Typography } from '@mui/material';
import axios from 'axios';
import Layout from '@/components/Layout';
import QuestionTable from '@/components/QuestionPage/QuestionTable';
import { QUESTION_SVC_URI } from '@/config/uris';
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
  const { prepareToken, accessToken } = useAuthContext();
  const [selectedQuestion, setSelectedQuestion] = useState({
    _id: '',
    title: '',
    description: '',
    categories: [],
    link: '',
    difficulty: 'Easy',
  });

  const getAllQuestions = useCallback(async () => {
    setIsLoading(true);
    console.log("getting questions...")
    try {
      await prepareToken();

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      console.log("token in questions:", accessToken);

      const response = await axios.get(QUESTION_SVC_URI, config);
      setQuestions(response.data);
    } catch (err) {
      console.error(err);
      setError('An error occurred while retrieving the questions. Please try again later.');
    } 

    setIsLoading(false);
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      getAllQuestions();
    }
  }, [getAllQuestions]);

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
