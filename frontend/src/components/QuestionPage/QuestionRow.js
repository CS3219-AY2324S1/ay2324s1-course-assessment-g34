import { ArrowDropDownRounded, ArrowRightRounded, DeleteForeverRounded, LinkRounded } from "@mui/icons-material";
import { Box, Chip, Collapse, IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import React, { useState } from "react";
import QuestionCategoryList from "./QuestionCategoryList";
import DeleteQuestionDialog from "./DeleteQuestionDialog";
import EditQuestion from "./EditQuestion";

const getComplexityColour = (complexity) => {
  switch(complexity) {
    case "Easy":
      return "success";
    case "Medium":
      return "warning";
    case "Hard":
      return "error";
    default:
  }
  return;
}

export default function QuestionRow({ row, index, setQuestions }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const updateDeletedQuestions = (index) => {
    setQuestions((prevState) => prevState.filter((_, i) => i !== index));
  }

  const handleDelete = async () => {
    const questions = JSON.parse(localStorage.getItem('questions'));
    questions.splice(index, 1);
    localStorage.setItem('questions', JSON.stringify(questions));
    updateDeletedQuestions(index);
  }

  return (
    <>
      <TableRow
        sx={{ '& > *': {
            borderBottom: 'unset',
          },
          bgcolor: '#fbfbfb',
        }}
      >
        <TableCell sx={{ py: 0, maxWidth: '30px',borderColor: '#c4c4c4' }}>
          <IconButton
            color="primary"
            aria-label="expand row"
            size="small"
            onClick={() => setIsOpen(!isOpen)}
          >
            { isOpen ? <ArrowDropDownRounded fontSize="large"/> : <ArrowRightRounded fontSize="large"/> }
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{
            py: 0,
            fontWeight: 600,
            borderColor: '#c4c4c4',
            color: (theme) => theme.palette.primary.main,
          }}
        >
          {row.title}
        </TableCell>
        <TableCell
          align="right"
          sx={{ py: 0, fontWeight: 600, borderColor: '#c4c4c4' }}
        >
          <Chip color={getComplexityColour(row.complexity)} label={row.complexity} />
        </TableCell>
        <TableCell
          align="right"
          sx={{ py: 0, pl: 0, borderColor: '#c4c4c4' }}
        >
          <Tooltip title="Link" arrow>
            <IconButton href={row.link} color="secondary">
              <LinkRounded />
            </IconButton>
          </Tooltip>
          <EditQuestion setQuestions={setQuestions} index={index} question={row} />
          <Tooltip title="Delete" arrow>
            <IconButton
              sx={{ color: (theme) => theme.palette.error.main }}
              onClick={() => setIsDeleteDialogOpen(true)}
              aria-haspopup="true"
            >
              <DeleteForeverRounded/>
            </IconButton>
          </Tooltip>
          <DeleteQuestionDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            handleDelete={handleDelete}
            question={row}
          />
        </TableCell>
      </TableRow>
      <TableRow sx={{ bgcolor: '#fbfbfb' }}>
        <TableCell sx={{ py: 0 }} colSpan={6}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ mx: 1, my: 2 }}>
              <QuestionCategoryList categories={row.categories} />
              <Box sx={{ mx: 1, my: 3 }}>
                <div className="ck-content" dangerouslySetInnerHTML={{ __html: row.description}}></div>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}