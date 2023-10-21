import { Chip } from "@mui/material";
import React from "react";

const difficultyToColorMap = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
};

export default function DifficultyChip(props) {
  return (
    <Chip {...props} color={difficultyToColorMap[props.difficulty]} label={props.difficulty} />
  )
}