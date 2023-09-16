import { AppBar, Box, Dialog, FormControl, IconButton, MenuItem, Slide, TextField, Toolbar, Typography } from "@mui/material";
import { AddBox, Close } from "@mui/icons-material";
import React, { forwardRef, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./QuestionDescriptionEditor"), { ssr: false });

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
});

const difficulties = [
  {
    value: 'EASY',
    label: 'Easy'
  },
  {
    value: 'MEDIUM',
    label: 'Medium'
  },
  {
    value: 'HARD',
    label: 'Hard'
  }
];

export default function AddQuestionForm() {
  const editorRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Box sx={{ display: 'flex'}}>
      <IconButton
        size="medium"
        onClick={handleClickOpen}
        sx={{ marginLeft: 'auto', color: (theme) => theme.palette.secondary.main }}
      >
        <AddBox fontSize="large"/>
      </IconButton>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography
              sx={{ flex: 1 }}
              variant="h6"
              component="div"
            >
              Create a Question
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', bgcolor: 'white'}}>
            <TextField
              sx={{ m: 1, width: '25ch', bgcolor: (theme) => theme.palette.primary.light }}
              size="small"
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              InputLabelProps={{ sx: { color: (theme) => theme.palette.primary.contrastText }}}
            />
            <TextField
              id="difficulty"
              select
              size="small"
              label="Difficulty"
              defaultValue="EASY"
              sx={{ m: 1, width: '25ch' }}
            >
              {difficulties.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', bgcolor: 'white'}}>
            <TextField
              sx={{ m: 1, width: '50ch', bgcolor: (theme) => theme.palette.primary.light }}
              size="small"
              autoFocus
              margin="dense"
              id="topics"
              label="Topics"
              type="text"
              InputLabelProps={{ sx: { color: (theme) => theme.palette.primary.contrastText }}}
            />
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', bgcolor: 'white'}}>
            <Editor
              editorRef={editorRef}
              onChange={(v) =>  console.log(v)}
            />
          </Box>
        </AppBar>
      </Dialog>
    </Box>
  );
}