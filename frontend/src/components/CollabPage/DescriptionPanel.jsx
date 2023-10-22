import {
  Accordion, AccordionDetails, AccordionSummary, Box, Chip, Paper, Stack, Toolbar, Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { ExpandMore } from '@mui/icons-material';
import SolidButton from '../SolidButton';
import DifficultyChip from '../DifficultyChip';
import QuestionCategoryList from '../QuestionPage/QuestionCategoryList';

export default function DescriptionPanel() {
  const question = {
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    categories: ['Array', 'Queue', 'Sliding Window', 'Heap (Priority Queue)', 'Monotonic Queue'],
    description: '<p>You are given an array of integers <code>nums</code>, there is a sliding '
      + 'window of size <code>k</code> which is moving from the very left of the array to the '
      + 'very right. You can only see the <code>k</code> numbers in the window. Each time the '
      + 'sliding window moves right by one position.</p><br/><p>Return the max sliding window.</p>'
      + '<p>test sada sadadadkpdakdpakdpakdpakdpokrsarraraaradpkkdsdsdsdsdsdsdsddsds adkapdkapd opaskd pakpd kspodaopko da</p>'
      + '<p>test sada sadadadkpdakdpakdpakdpakdpokrsarraraaradpkkdsdsdsdsdsdsdsddsds adkapdkapd opaskd pakpd kspodaopko da</p>'
      + '<p>test sada sadadadkpdakdpakdpakdpakdpokrsarraraaradpkkdsdsdsdsdsdsdsddsds adkapdkapd opaskd pakpd kspodaopko da</p>'
      + '<p>test sada sadadadkpdakdpakdpakdpakdpokrsarraraaradpkkdsdsdsdsdsdsdsddsds adkapdkapd opaskd pakpd kspodaopko da</p>'
      + '<p>test sada sadadadkpdakdpakdpakdpakdpokrsarraraaradpkkdsdsdsdsdsdsdsddsds adkapdkapd opaskd pakpd kspodaopko da</p>'
      + '<p>test sada sadadadkpdakdpakdpakdpakdpokrsarraraaradpkkdsdsdsdsdsdsdsddsds adkapdkapd opaskd pakpd kspodaopko da</p>'
      + '<p>test sada sadadadkpdakdpakdpakdpakdpokrsarraraaradpkkdsdsdsdsdsdsdsddsds adkapdkapd opaskd pakpd kspodaopko da</p>'
      + '<p>test sada sadadadkpdakdpakdpakdpakdpokrsarraraaradpkkdsdsdsdsdsdsdsddsds adkapdkapd opaskd pakpd kspodaopko da</p>'
      + '<p>test sada sadadadkpdakdpakdpakdpakdpokrsarraraaradpkkdsdsdsdsdsdsdsddsds adkapdkapd opaskd pakpd kspodaopko da</p>'
      + '<p>test sada sadadadkpdakdpakdpakdpakdpokrsarraraaradpkkdsdsdsdsdsdsdsddsds adkapdkapd opaskd pakpd kspodaopko da</p>'
      + '<p>test sada sadadadkpdakdpakdpakdpakdpokrsarraraaradpkkdsdsdsdsdsdsdsddsds adkapdkapd opaskd pakpd kspodaopko da</p>',
  };

  return (
    <Box
      component={Paper}
      sx={{
        display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'hidden',
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
        <SolidButton variant="contained" color="secondary" size="small" sx={{ ml: 'auto', fontSize: 12, textTransform: 'none' }}>
          Next Question
        </SolidButton>
      </Toolbar>
      <Stack sx={{
        gap: 1, py: 1, px: 2, overflowY: 'scroll',
      }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
          {question.title}
        </Typography>
        <Box>
          <DifficultyChip difficulty={question.difficulty} />
        </Box>
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
            <QuestionCategoryList categories={question.categories} />
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Box>
  );
}
