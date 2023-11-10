import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { IconButton, Paper, Stack, Toolbar, Typography } from "@mui/material";
import SolidButton from "../commons/SolidButton";

const ConsoleOutput = ({ output }) => {
  return (
    <Stack 
      sx={{
        gap: 1,
        py: 1,
        px: 2,
        overflowY: 'scroll',
        height: '100%',
        fontSize: 13,
        color: (theme) => theme.palette.primary.contrastText,
        bgcolor: (theme) => theme.palette.primary.main
      }}
    >
      {output ? output : "You must run your code first"}
    </Stack>
  );
};

export default function ConsolePanel({ isMinimized, setIsMinimized }) {
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <Paper
      sx={{
        height: isMinimized ? 'auto' : '40%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden',
        bgcolor: (theme) => theme.palette.primary.light
      }}
    >
      <Toolbar variant="dense" disableGutters sx={{ px: 2 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 14,
            color: (theme) => theme.palette.primary.contrastText,
          }}
        >
          Console
        </Typography>
        <IconButton
          size="small"
          onClick={toggleMinimize}
          sx={{ color: (theme) => theme.palette.primary.contrastText }}
        >
          {isMinimized ? <ExpandLess /> : <ExpandMore /> }
        </IconButton>
        <SolidButton
          variant="contained"
          color="success"
          size="small"
          sx={{ ml: 'auto', fontSize: 12, textTransform: 'none' }}

        >
          Run
        </SolidButton>
      </Toolbar>
      {!isMinimized && <ConsoleOutput />}
    </Paper>
  )
};
