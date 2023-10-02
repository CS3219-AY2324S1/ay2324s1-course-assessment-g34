import { EditRounded } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import QuestionForm from './QuestionForm';

// TODO: use dynamic importing for question form model
export default function EditQuestion({ setQuestions, index, question }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);

  const updateQuestions = (newQuestion) => {
    setQuestions((prevState) => {
      const updatedQuestions = [...prevState];
      updatedQuestions[index] = newQuestion;
      return updatedQuestions;
    });
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleSubmit = async (newQuestionData) => {
    // local storage
    const questions = JSON.parse(localStorage.getItem('questions'));
    questions[index] = newQuestionData;
    localStorage.setItem('questions', JSON.stringify(questions));
    updateQuestions(newQuestionData);

    // try {
    //   // change index to proper id from database
    //   const response = await axios.patch(`${UPDATE_QUESTION_SVC_URI}/${index}`, newQuestionData);

    //   // update state in client
    //   updateQuestions(index, updatedQuestionData);
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
    <>
      <Tooltip title="Edit" arrow>
        <IconButton onClick={handleOpen}>
          <EditRounded />
        </IconButton>
      </Tooltip>
      <QuestionForm
        question={question}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        label="Edit Question"
        id="edit_question"
        onSubmit={handleSubmit}
        generalError={error}
      />
    </>
  );
}

EditQuestion.propTypes = {
  setQuestions: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  question: PropTypes.shape({
    // id required after integration
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    link: PropTypes.string.isRequired,
    complexity: PropTypes.oneOf(['Easy', 'Medium', 'Hard']).isRequired,
  }).isRequired,
};
