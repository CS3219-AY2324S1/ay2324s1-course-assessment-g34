import styled from "@emotion/styled";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { IconButton, keyframes } from "@mui/material";
import React from "react";

const spinUp = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-180deg);
  }
`;

const spinDown = keyframes`
  from {
    transform: rotate(-180deg);
  }
  to {
    transform: rotate(0);
  }
`;

const ExpandLessIcon = styled(ExpandLess)(() => ({
  animation: `${spinDown} 0.2s`
}));

const ExpandMoreIcon = styled(ExpandMore)(() => ({
  animation: `${spinUp} 0.2s`
}));

export default function ExpandButton(props) {
  const { isUp, iconSize, ...buttonProps } = props;

  return (
    <IconButton
      {...buttonProps}
    >
      {isUp ? <ExpandLessIcon fontSize={iconSize} /> : <ExpandMoreIcon fontSize={iconSize} />}
    </IconButton>
  );
};
