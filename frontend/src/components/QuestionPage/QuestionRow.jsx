import {
  ArrowDropDownRounded, ArrowRightRounded, EditRounded, LinkRounded,
} from '@mui/icons-material';
import {
  Box, Collapse, IconButton, TableCell, TableRow, Tooltip,
} from '@mui/material';
import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Role } from '@/utils/constants';
import { useAuthContext } from '@/contexts/AuthContext';
import axios from 'axios';
import { QUESTION_SVC_URI } from '@/config/uris';
import { useRouter } from 'next/router';
import ComponentGuard from '../ComponentGuard';
import DeleteQuestionDialog from './DeleteQuestionDialog';
import QuestionCategoryList from './QuestionCategoryList';
import DifficultyChip from '../DifficultyChip';

export default function QuestionRow({
  question, setQuestions, setError, setSelectedQuestion, setIsEditModalOpen,
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { getAccessToken, setRedirect } = useAuthContext();

  const updateDeletedQuestions = () => {
    setQuestions((prevState) => prevState.filter((q) => q._id !== question._id));
  };

  const handleDelete = async () => {
    try {
      const token = await getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${QUESTION_SVC_URI}/${question._id}`, config);
      updateDeletedQuestions();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.error('Bad Request: ', err);
        setError('An error occurred. Please try again later.');
      } else if (err.response && err.response.status === 401) {
        // invalid token/token not provided; redirect to login page
        // TODO: logout
        console.error('Unauthenticated: ', err);
        setRedirect(router.asPath);
        router.push('/login');
      } else if (err.response && err.response.status === 403) {
        // valid token but not admin
        console.error('Forbidden: ', err);
        setError('You do not have enough permissions to perform this action.');
      } else {
        console.error('An error occurred: ', err);
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const openEditModal = () => {
    setSelectedQuestion(question);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <TableRow
        sx={{
          '& > *': {
            borderBottom: 'unset',
          },
          bgcolor: '#fbfbfb',
        }}
      >
        <TableCell sx={{ py: 0, maxWidth: '30px', borderColor: '#c4c4c4' }}>
          <IconButton
            color="primary"
            aria-label="expand row"
            size="small"
            onClick={() => setIsOpen(!isOpen)}
          >
            { isOpen ? <ArrowDropDownRounded fontSize="large" /> : <ArrowRightRounded fontSize="large" /> }
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
          {question.title}
        </TableCell>
        <TableCell
          align="right"
          sx={{ py: 0, fontWeight: 600, borderColor: '#c4c4c4' }}
        >
          <DifficultyChip difficulty={question.difficulty} />
        </TableCell>
        <TableCell
          align="right"
          sx={{ py: 0, pl: 0, borderColor: '#c4c4c4' }}
        >
          <Tooltip title="Link" arrow>
            <IconButton href={question.link} color="secondary">
              <LinkRounded />
            </IconButton>
          </Tooltip>
          <ComponentGuard allowedRoles={[Role.ADMIN]}>
            <Tooltip title="Edit" arrow>
              <IconButton onClick={openEditModal}>
                <EditRounded />
              </IconButton>
            </Tooltip>
            <DeleteQuestionDialog
              handleDelete={handleDelete}
              title={question.title}
            />
          </ComponentGuard>
        </TableCell>
      </TableRow>
      <TableRow sx={{ bgcolor: '#fbfbfb' }}>
        <TableCell sx={{ py: 0 }} colSpan={6}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ mx: 1, my: 2 }}>
              <QuestionCategoryList categories={question.categories} />
              <Box sx={{ mx: 1, my: 3 }}>
                <div className="ck-content" dangerouslySetInnerHTML={{ __html: question.description }} />
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

QuestionRow.propTypes = {
  question: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    link: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf(['Easy', 'Medium', 'Hard']).isRequired,
  }).isRequired,
  setQuestions: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  setSelectedQuestion: PropTypes.func.isRequired,
  setIsEditModalOpen: PropTypes.func.isRequired,
};
