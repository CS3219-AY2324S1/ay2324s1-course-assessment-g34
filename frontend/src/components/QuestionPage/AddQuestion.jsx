import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { AddBox } from '@mui/icons-material';
import axios from 'axios';
import { ADD_QUESTION_SVC_URI } from '@/config/uris';
import { PropTypes } from 'prop-types';
import QuestionForm from './QuestionForm';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

// TODO: use dynamic importing for question form model
export default function AddQuestion({ setQuestions }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const { getAccessToken, setRedirect } = useAuthContext();

  const updateQuestions = (question) => {
    setQuestions((prev) => [...prev, question]);
  };

  const handleSubmit = async (newQuestionData) => {
    // TODO: make some toast pop up to notify user that a question has been added successfully
    try {
      const token = await getAccessToken();
      // KIV: "Bearer ${token}" results in invalid token error
      const config = {
        headers: {
          'Authorization': token
        }
      };

      const response = await axios.post(ADD_QUESTION_SVC_URI, newQuestionData, config);

      // add new question on client side
      updateQuestions(response.data);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.error("Bad Request: ", err);
        setError("An error occurred. Please try again later.");
      } else if (err.response && err.response.status === 401) {
        // invalid token/token not provided; redirect to login page
        console.error("Unauthenticated: ", err);
        setRedirect(router.asPath);
        router.push('/login');
      } else if (err.response && err.response.status === 403) {
        // valid token but not admin
        console.error("Forbidden: ", err);
        setError("You do not have enough permissions to perform this action.");
      } else {
        console.error("An error occurred: ", err);
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Tooltip title="Add" arrow>
        <IconButton
          size="medium"
          onClick={() => setIsOpen(true)}
          sx={{
            marginLeft: 'auto',
            color: (theme) => theme.palette.secondary.main,
          }}
        >
          <AddBox fontSize="large" />
        </IconButton>
      </Tooltip>
      <QuestionForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        label="Create a Question"
        id="add_question"
        onSubmit={handleSubmit}
        generalError={error}
      />
    </Box>
  );
}

AddQuestion.propTypes = {
  setQuestions: PropTypes.func.isRequired,
};
