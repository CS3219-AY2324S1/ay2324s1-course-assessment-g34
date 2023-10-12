import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import QuestionRow from './QuestionRow';

export default function QuestionTable({
  questions, setQuestions, setError, setSelectedQuestion, setIsEditModalOpen,
}) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderColor: '#747474' }} />
            <TableCell
              sx={{ color: (theme) => theme.palette.secondary.main, borderColor: '#747474' }}
            >
              Title
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: (theme) => theme.palette.secondary.main, borderColor: '#747474' }}
            >
              Complexity
            </TableCell>
            <TableCell sx={{ borderColor: '#747474' }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question) => (
            <QuestionRow
              key={question._id}
              question={question}
              setQuestions={setQuestions}
              setError={setError}
              setSelectedQuestion={setSelectedQuestion}
              setIsEditModalOpen={setIsEditModalOpen}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

QuestionTable.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      categories: PropTypes.arrayOf(PropTypes.string).isRequired,
      link: PropTypes.string.isRequired,
      complexity: PropTypes.oneOf(['Easy', 'Medium', 'Hard']).isRequired,
    }),
  ).isRequired,
  setQuestions: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  setSelectedQuestion: PropTypes.func.isRequired,
  setIsEditModalOpen: PropTypes.func.isRequired,
};
