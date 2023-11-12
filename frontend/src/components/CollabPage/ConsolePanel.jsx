import { Box, Paper, Stack, Toolbar, Typography } from "@mui/material";
import React from "react";
import ExpandButton from "./ExpandButton";

export default function ConsolePanel({ isMinimized, setIsMinimized }) {
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <Box
      component={Paper}
      height={isMinimized ? 'auto' : '40%'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toolbar variant="dense" disableGutters sx={{ px: 2, bgcolor: (theme) => theme.palette.primary.main }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 14,
            color: (theme) => theme.palette.primary.contrastText,
          }}
        >
          Console 
        </Typography>
        <ExpandButton
          size="small"
          sx={{ ml: 'auto', color: (theme) => theme.palette.primary.contrastText}}
          onClick={toggleMinimize}
          isUp={isMinimized}
          iconSize="large"
        />
      </Toolbar>
      {!isMinimized &&
        <Stack sx={{ gap: 1, height: '100%' }}>

        </Stack>
      }
    </Box>
  );
}
