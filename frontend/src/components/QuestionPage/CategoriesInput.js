import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";

export default function CategoriesInput({ onChange }) {

  return (
    <Autocomplete
      multiple
      autoHighlight
      id="categories"
      options={[]}
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