import {
  Accordion, AccordionDetails, AccordionSummary, Box, Paper, Skeleton, Stack, Toolbar, Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { ExpandMore } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsQuestionLoading, selectQuestionId, setIsQuestionLoading, setQuestionId,
} from '@/features/session/sessionSlice';
import axios from 'axios';
import { QUESTION_SVC_URI } from '@/config/uris';
import { useAuthContext } from '@/contexts/AuthContext';
import PropTypes from 'prop-types';
import QuestionCategoryList from '../QuestionPage/QuestionCategoryList';
import DifficultyChip from '../DifficultyChip';
import SolidButton from '../SolidButton';

export default function QuestionPanel({ fetchSessionQuestion, openSnackbar, collabPageGetQid, isMinimized }) {
  const { getAccessToken } = useAuthContext();
  const questionId = useSelector(selectQuestionId);
  collabPageGetQid(questionId);
  const [question, setQuestion] = useState(null);

  const isQuestionLoading = useSelector(selectIsQuestionLoading);
  const dispatch = useDispatch();

  const getQuestion = async () => {
    try {
      const token = await getAccessToken();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${QUESTION_SVC_URI}/${questionId}`, config);
      setQuestion(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.error(err.response.message, err);
        openSnackbar();
      } else {
        console.error('An error occurred:', err);
      }
    } finally {
      dispatch(setIsQuestionLoading(false));
    }
  };

  useEffect(() => {
    if (questionId) {
      dispatch(setQuestionId(questionId));
      getQuestion();
    }
  }, [questionId]);

  return (
    <Box
      component={Paper}
      flexGrow={isMinimized && 1}
      sx={{
        display: 'flex', flexDirection: 'column', overflowY: 'hidden', height: '60%'
      }}
    >
      <Toolbar variant="dense" disableGutters sx={{ px: 2, bgcolor: (theme) => theme.palette.primary.main }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 14,
            color: (theme) => theme.palette.primary.contrastText,
          }}
        >
          Description
        </Typography>
        <SolidButton
          variant="contained"
          color="secondary"
          size="small"
          sx={{ ml: 'auto', fontSize: 12, textTransform: 'none' }}
          onClick={fetchSessionQuestion}
          disabled={isQuestionLoading}
        >
          Next Question
        </SolidButton>
      </Toolbar>
      <Stack sx={{
        gap: 1, py: 1, px: 2, overflowY: 'scroll',
      }}
      >
        {isQuestionLoading
          ? <Skeleton variant="text" sx={{ fontSize: 20 }} />
          : question && (
            <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
              {question.title}
            </Typography>
          )}
        <Box>
          {isQuestionLoading
            ? <Skeleton variant="rectangular" width={90} height={40} />
            : question && <DifficultyChip difficulty={question.difficulty} />}
        </Box>
        {isQuestionLoading
          ? <Skeleton variant="rectangular" width="100%" height={300} />
          : question && (
            <Box sx={{
              fontSize: 14,
              wordBreak: 'break-word',
              WebkitHyphens: 'auto',
              MozHyphens: 'auto',
              msHyphens: 'auto',
              hyphens: 'auto',
            }}
            >
              <div className="ck-content" dangerouslySetInnerHTML={{ __html: question.description }} />
            </Box>
          )}
        <Accordion
          disableGutters
          elevation={0}
          sx={{
            '&:before': {
              display: 'none',
            },
            borderTop: '1px solid lightgrey',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
          >
            <Typography>
              Categories
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {isQuestionLoading
              ? <Skeleton variant="rectangular" width="100%" height={180} />
              : question && <QuestionCategoryList categories={question.categories} />}
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Box>
  );
}

QuestionPanel.propTypes = {
  fetchSessionQuestion: PropTypes.func.isRequired,
  openSnackbar: PropTypes.func.isRequired,
};
