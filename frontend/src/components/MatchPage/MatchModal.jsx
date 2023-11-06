import {
  Dialog, DialogContent, DialogContentText, DialogTitle, Slide,
} from '@mui/material';
import React, { forwardRef } from 'react';
import { PropTypes } from 'prop-types';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function MatchModal({ isOpen, matchedUser }) {
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
    </Dialog>
  );
}

MatchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  matchedUser: PropTypes.string,
};
