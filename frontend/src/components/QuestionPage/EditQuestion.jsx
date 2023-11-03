import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useAuthContext } from '@/contexts/AuthContext';
import axios from 'axios';
import { QUESTION_SVC_URI } from '@/config/uris';
import { useRouter } from 'next/router';
import QuestionForm from './QuestionForm';

// TODO: use dynamic importing for question form model
export default function EditQuestion({
  setQuestions, question, isOpen, setIsOpen,
}) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const { getAccessToken, setRedirect } = useAuthContext();

  const updateQuestions = (newQuestion) => {
    setQuestions((prevState) => prevState.map((q) => (q._id === question._id ? newQuestion : q)));
  };

  const handleSubmit = async (newQuestionData) => {
    try {
      const token = await getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.patch(`${QUESTION_SVC_URI}/${question._id}`, newQuestionData, config);

      // update state in client
      updateQuestions(response.data);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.error('Bad Request: ', err);
        setError('An error occurred. Please try again later.');
      } else if (err.response && err.response.status === 401) {
        // invalid token/token not provided; redirect to login page
        console.error('Unauthenticated: ', err);
        setRedirect(router.asPath);
        router.push('/login');
      } else if (err.response && err.response.status === 403) {
        // valid token but not admin
        setError('You do not have enough permissions to perform this action.');
      } else {
        console.error('An error occurred: ', err);
        setError('An error occurred. Please try again later.');
      }
    }
  };

  // TODO: try returning access token directly after refreshing

  return (
    <QuestionForm
      question={question}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      label="Edit Question"
      id="edit_question"
      onSubmit={handleSubmit}
      generalError={error}
    />
  );
}

EditQuestion.propTypes = {
  setQuestions: PropTypes.func.isRequired,
  question: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    link: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf(['Easy', 'Medium', 'Hard']).isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};
