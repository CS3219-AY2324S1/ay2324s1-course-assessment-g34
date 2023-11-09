import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import SolidButton from '../SolidButton';
import { SlideTransition } from '../commons/transitions';

export default function ConfirmEndModal({ isOpen, setIsOpen, handleEndSession }) {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={SlideTransition('up')}
      fullWidth
      maxWidth="sm"
      keepMounted
      onClose={handleClose}
      sx={{ textAlign: 'center' }}
    >
      <DialogTitle>End Session</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Are you sure you want to end this session?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <SolidButton
          size="medium"
          color="error"
          type="button"
          sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={handleEndSession}
        >
          End Session
        </SolidButton>
        <SolidButton
          size="medium"
          color="primary"
          type="button"
          sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={handleClose}
        >
          Cancel
        </SolidButton>
      </DialogActions>
    </Dialog>
  );
}

ConfirmEndModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  handleEndSession: PropTypes.func.isRequired,
};
