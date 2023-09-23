import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import QuestionRow from './QuestionRow';

const createRows = (questions) => questions.map((q) => ({
  id: q.id,
  title: q.title,
  description: q.description,
  categories: q.categories,
  link: q.link,
  complexity: q.complexity,
}));

export default function QuestionTable({ questions, setQuestions }) {
  const rows = createRows(questions);

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
          {rows.map((row, index) => (
            // change key to id after integration
            <QuestionRow key={index} row={row} index={index} setQuestions={setQuestions} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

QuestionTable.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      // id required after integration
      id: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      categories: PropTypes.arrayOf(PropTypes.string).isRequired,
      link: PropTypes.string.isRequired,
      complexity: PropTypes.oneOf(['Easy', 'Medium', 'Hard']).isRequired,
    }),
  ).isRequired,
  setQuestions: PropTypes.func.isRequired,
};
