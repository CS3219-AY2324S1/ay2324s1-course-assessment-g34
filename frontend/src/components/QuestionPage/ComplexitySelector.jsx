import { MenuItem, TextField } from '@mui/material';
import React from 'react';

const complexities = [
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

export default function ComplexitySelector(props) {
  return (
    <TextField
      {...props}
      select
      id="complexity"
      name="complexity"
      label="Complexity"
      defaultValue="Easy"
    >
      {complexities.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
