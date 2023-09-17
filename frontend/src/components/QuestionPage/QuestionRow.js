import { ArrowDropDownRounded, ArrowRightRounded, DeleteForeverRounded, EditRounded } from "@mui/icons-material";
import { Box, Collapse, IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import React, { useState } from "react";
import QuestionCategoryList from "./QuestionCategoryList";

const getComplexityColour = (complexity) => {
  switch(complexity) {
    case "Easy":
      return (theme) => theme.palette.success.main;
    case "Medium":
      return (theme) => theme.palette.warning.main;
    case "Hard":
      return (theme) => theme.palette.error.main;
    default:

  }
  return;
}

export default function QuestionRow({ row, index, setQuestions }) {
  const [isOpen, setIsOpen] = useState(false);

  const updateQuestions = (index) => {
    setQuestions((prevState) => prevState.filter((_, i) => i !== index));
  }

  const handleDelete = async () => {
    const questions = JSON.parse(localStorage.getItem('questions'));
    questions.splice(index, 1);
    localStorage.setItem('questions', JSON.stringify(questions));
    updateQuestions(index);
    
  }

  return (
    <>
      <TableRow
        sx={{ '& > *': {
            borderBottom: 'unset',
          },
          bgcolor: (theme) => theme.palette.primary.light
        }}
      >
        <TableCell
          sx={{ py: 0, color: (theme) => theme.palette.primary.contrastText, borderColor: (theme) => theme.palette.primary.dark, maxWidth: '30px' }}
        >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setIsOpen(!isOpen)}
            sx={{ color: (theme) => theme.palette.primary.contrastText }}
          >
            { isOpen ? <ArrowDropDownRounded fontSize="large"/> : <ArrowRightRounded fontSize="large"/> }
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ py: 0, fontWeight: 600, color: (theme) => theme.palette.primary.contrastText, borderColor: (theme) => theme.palette.primary.dark }}
        >
          {row.title}
        </TableCell>
        <TableCell
          align="right"
          sx={{ py: 0, fontWeight: 600, color: getComplexityColour(row.complexity), borderColor: (theme) => theme.palette.primary.dark }}
        >
          {row.complexity}
        </TableCell>
        <TableCell
          align="right"
          sx={{
            py: 0,
            pl: 0,
            borderColor: (theme) => theme.palette.primary.dark }}
        >
          <Tooltip title="Edit" arrow>
            <IconButton
              sx={{
                color: (theme) => theme.palette.primary.contrastText
              }}
            >
              <EditRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <IconButton
              sx={{
                color: (theme) => theme.palette.error.main
              }}
              onClick={handleDelete}
            >
              <DeleteForeverRounded/>
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow
        sx={{
          bgcolor: (theme) => theme.palette.primary.light,
          color: (theme) => theme.palette.primary.contrastText,
        }}
      >
        <TableCell
          sx={{
            py: 0,
            borderColor: (theme) => theme.palette.primary.dark }}
          colSpan={6}
        >
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ mx: 1, my: 2 }}>
              <QuestionCategoryList categories={row.categories} />
              <Box sx={{ margin: 1, color: (theme) => theme.palette.primary.contrastText }}>
                <div dangerouslySetInnerHTML={{ __html: row.description}}></div>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}