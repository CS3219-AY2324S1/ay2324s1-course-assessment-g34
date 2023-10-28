import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material";
import React, { forwardRef } from "react";
import SolidButton from "../SolidButton";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function ConfirmEndModal({ isOpen, setIsOpen, handleEndSession }) {
  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
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
          variant="contained"
          size="medium"
          color="error"
          type="button"
          sx={{ textTransform: 'none', fontWeight: 600 }}
          onClick={handleEndSession}
        >
          End Session
        </SolidButton>
        <SolidButton
          variant="contained"
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