import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide,
} from '@mui/material';
import React, { forwardRef } from 'react';
import SolidButton from '../SolidButton';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function MatchModal({ isOpen, handleDecline, handleAccept, matchedUser }) {
  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="sm"
      sx={{ textAlign: 'center' }}
    >
      <DialogTitle>Match Found!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You have been matched with:
        </DialogContentText>
        <DialogContentText color="secondary" sx={{ fontWeight: 600 }}>
          {matchedUser}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <SolidButton
          variant="contained"
          size="medium"
          color="error"
          type="submit"
          sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={handleDecline}
        >
          Decline
        </SolidButton>
        <SolidButton
          variant="contained"
          size="medium"
          color="success"
          type="submit"
          sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={handleAccept}
        >
          Accept
        </SolidButton>
      </DialogActions>
    </Dialog>
  );
}
