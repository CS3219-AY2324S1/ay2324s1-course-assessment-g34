import { Chip } from '@mui/material';
import React from 'react';
import { PropTypes } from 'prop-types';

const difficultyToColorMap = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
};

export default function DifficultyChip(props) {
  const { difficulty } = props;

  return (
    <Chip {...props} color={difficultyToColorMap[difficulty]} label={difficulty} />
  );
}

DifficultyChip.propTypes = {
  difficulty: PropTypes.string.isRequired,
};
