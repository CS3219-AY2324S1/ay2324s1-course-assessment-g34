import { Close, DeleteForeverRounded } from '@mui/icons-material';
import PropTypes from 'prop-types';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography,
} from '@mui/material';
import React, { useState } from 'react';
import SolidButton from '../SolidButton';

export default function DeleteQuestionDialog({ handleDelete, title }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDeleteAndClose = () => {
    handleDelete();
    handleClose();
  };

  return (
    <>
      <Tooltip title="Delete" arrow>
        <IconButton
          sx={{ color: (theme) => theme.palette.error.main }}
          onClick={() => setIsOpen(true)}
          aria-haspopup="true"
        >
          <DeleteForeverRounded />
        </IconButton>
      </Tooltip>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            component="div"
          >
            Delete Question
          </Typography>
          <IconButton edge="end" aria-label="close" sx={{ ml: 'auto' }} onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          Are you sure you want to delete the question titled:
          {' '}
          <strong>{title}</strong>
          ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <SolidButton onClick={handleDeleteAndClose} color="error">
            Delete
          </SolidButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

DeleteQuestionDialog.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
