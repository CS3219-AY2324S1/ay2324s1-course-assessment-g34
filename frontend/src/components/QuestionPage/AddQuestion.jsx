import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { AddBox } from '@mui/icons-material';
// import axios from 'axios';
// import { ADD_QUESTION_SVC_URI } from '@/config/uris';
import { PropTypes } from 'prop-types';
import QuestionForm from './QuestionForm';

export default function AddQuestion({ setQuestions }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);

  const updateQuestions = (question) => {
    setQuestions((prev) => [...prev, question]);
  };

  const handleSubmit = async (newQuestionData) => {
    // local storage
    const questions = JSON.parse(localStorage.getItem('questions'));
    questions.push(newQuestionData);
    localStorage.setItem('questions', JSON.stringify(questions));
    updateQuestions(newQuestionData);

    // try {
    //   const response = await axios.post(ADD_QUESTION_SVC_URI, newQuestionData);

    //   // add new question on client side
    //   updateQuestions(response.data);
    // } catch (error) {
    //   if (error.response && error.response.status === 400) {
    //     console.error("Bad Request: ", error.response.data);
    //   } else {
    //     console.error("An error occurred: ", error);
    //   }
    //   setError("An error occurred. Please try again later.");
    // }
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
