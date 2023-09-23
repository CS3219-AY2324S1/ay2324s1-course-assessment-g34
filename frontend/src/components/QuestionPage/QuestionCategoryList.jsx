import React from 'react';
import { PropTypes } from 'prop-types';
import { Chip, Stack } from '@mui/material';

export default function QuestionCategoryList({ categories }) {
  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {categories.map((cat) => (
        <Chip key={cat} label={cat} color="secondary" sx={{ fontWeight: '600' }} />
      ))}
    </Stack>
  );
}

QuestionCategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
};

QuestionCategoryList.defaultProps = {
  categories: [],
};
