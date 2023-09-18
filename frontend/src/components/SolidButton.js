import React from "react";
import { Button, styled } from "@mui/material";

const SolidButton = styled(Button)(({ theme, color = 'primary' }) => ({
  '&.MuiButton-contained': {
    backgroundColor: theme.palette[color].main,
  },
  ':hover': {
    backgroundColor: theme.palette[color].dark,
  },
}));

export default SolidButton;