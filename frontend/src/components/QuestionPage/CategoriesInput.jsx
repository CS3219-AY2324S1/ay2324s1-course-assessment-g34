import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { PropTypes } from 'prop-types';

export default function CategoriesInput({ onChange, value }) {
  return (
    <Autocomplete
      multiple
      autoHighlight
      id="categories"
      options={[]}
      value={value}
      freeSolo
      fullWidth
      onChange={(e, newVal) => onChange(newVal)}
      renderInput={(params) => (
        <TextField
          {...params}
          name="categories"
          variant="outlined"
          label="Categories"
          size="small"
          margin="dense"
        />
      )}
    />
  );
}

CategoriesInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
};
