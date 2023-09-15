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
      difficulty: q.difficulty
    }
  })
}

export default function QuestionTable({ questions }) {
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
              Difficulty
            </TableCell>
            <TableCell sx={{ borderColor: '#747474' }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <QuestionRow key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}