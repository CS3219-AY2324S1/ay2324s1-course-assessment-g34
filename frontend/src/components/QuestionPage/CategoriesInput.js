import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";

export default function CategoriesInput() {
  const [categories, setCategories] = useState([]);

  return (
    <Autocomplete
      multiple
      autoHighlight
      id="categories"
      options={[]}
      freeSolo
      sx={{ m: 1 }}
      fullWidth
      onChange={(e, newVal) => setCategories(newVal)}
      value={categories}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Categories"
          size="small"
          margin="dense"
        />
      )}
    />
  );
}