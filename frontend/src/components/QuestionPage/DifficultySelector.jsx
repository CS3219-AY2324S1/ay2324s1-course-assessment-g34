import { MenuItem, TextField } from '@mui/material';
import React from 'react';

const difficulties = [
  {
    value: 'Easy',
    label: 'Easy',
  },
  {
    value: 'Medium',
    label: 'Medium',
  },
  {
    value: 'Hard',
    label: 'Hard',
  },
];

export default function DifficultySelector(props) {
  return (
    <TextField
      {...props}
      select
      id="difficulty"
      name="difficulty"
      label="Difficulty"
      defaultValue="Easy"
    >
      {difficulties.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
