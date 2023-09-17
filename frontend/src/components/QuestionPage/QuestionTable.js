import React from "react";
import {  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import QuestionRow from "./QuestionRow";

const createRows = (questions) => {
  return questions.map((q) => {
    return {
      id: q.id,
      title: q.title,
      description: q.description,
      categories: q.categories,
      complexity: q.complexity
    }
  })
}

export default function QuestionTable({ questions, setQuestions }) {
  const rows = createRows(questions);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow sx={{ bgcolor: (theme) => theme.palette.primary.dark }}>
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
            <QuestionRow key={index} row={row} index={index} setQuestions={setQuestions}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}