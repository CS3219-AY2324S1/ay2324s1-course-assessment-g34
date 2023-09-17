import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";

export default function DeleteQuestionDialog(props) {
  const { isOpen, onClose, handleDelete, question, ...other } = props;

  const handleDeleteAndClose = () => {
    handleDelete();
    onClose();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      {...other}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center'}}>
          <Typography
            variant="h6"
            component="div"
          >
            Delete Question
          </Typography>
          <IconButton edge="end" aria-label="close" sx={{ ml: 'auto' }} onClick={onClose}>
            <Close />
          </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        Are you sure you want to delete the question titled: <strong>{question.title}</strong>?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleDeleteAndClose} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}