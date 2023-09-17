import { ArrowDropDownRounded, ArrowRightRounded } from "@mui/icons-material";
import { Box, Collapse, IconButton, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import QuestionCategoryList from "./QuestionCategoryList";

export default function QuestionRow({ row }) {
  const [isOpen, setIsOpen] = useState(false);

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
          sx={{ py: 0, fontWeight: 600, color: (theme) => theme.palette.primary.contrastText, borderColor: (theme) => theme.palette.primary.dark }}
        >
          {row.complexity}
        </TableCell>
        <TableCell
          sx={{ py: 0, color: (theme) => theme.palette.primary.contrastText, borderColor: (theme) => theme.palette.primary.dark }}
        />
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