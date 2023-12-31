import { selectMatchedUsername, selectSessionId } from '@/features/match/matchSlice';
import { selectIsOngoing } from '@/features/session/sessionSlice';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography,
} from '@mui/material';
import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SolidButton from '../commons/SolidButton';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function LeaveSessionModal({ handleEndSession }) {
  const isOngoing = useSelector(selectIsOngoing);
  const matchedUser = useSelector(selectMatchedUsername);
  const sessionId = useSelector(selectSessionId);

  return (
    <Dialog
      open={!isOngoing && sessionId !== null}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="sm"
      sx={{ textAlign: 'center' }}
    >
      <DialogTitle>Session Ended</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          <Typography component="span" color="secondary" sx={{ fontWeight: 600 }}>{matchedUser}</Typography>
          {' '}
          has left the room.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
        <SolidButton
          variant="contained"
          onClick={handleEndSession}
          size="medium"
          color="error"
          type="button"
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Leave Room
        </SolidButton>
      </DialogActions>
    </Dialog>
  );
}

LeaveSessionModal.propTypes = {
  handleEndSession: PropTypes.func.isRequired,
};
