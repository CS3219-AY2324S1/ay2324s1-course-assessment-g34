import React from "react";
import { Chip, Stack } from "@mui/material";

export default function QuestionCategoryList({ categories }) {
  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {categories.map((cat) => (
        <Chip key={cat} label={cat} color="secondary" sx={{ fontWeight: '600' }}/>
      ))}
    </Stack>
  );
}