import React, { useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar,
} from '@mui/material';
import axios from 'axios';
import { USER_SVC_URI } from '@/config/uris';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { SlideTransition } from '../commons/transitions';
import SolidButton from '../SolidButton';

export default function DeleteAccountButton({
  user, openSnackbar, setSnackbarColor, setMessage,
}) {
  const path = useRouter().asPath;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getAccessToken, setRedirect, logout } = useAuthContext();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const token = await getAccessToken();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${USER_SVC_URI}/${user.username}`, config);
      console.log('User deleted: ', user.username);

      setMessage('Your account has successfully been deleted.');
      setSnackbarColor('success');
      openSnackbar();
      setTimeout(() => logout(), 2000);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setMessage('You must be logged in to delete this account.');
        setSnackbarColor('error');
        openSnackbar();
        setRedirect(path);
        setTimeout(() => logout(), 2000);
      } else if (err.response && err.response.status === 403) {
        setMessage('You do not have permissions to delete this account.');
        setSnackbarColor('error');
        openSnackbar();
      } else if (err.response && err.response.status === 404) {
        setMessage('The account you are trying to delete does not exist.');
        setSnackbarColor('error');
        openSnackbar();
      } else {
        // server errors
        console.log(err);
        setMessage('An error occurred. Please try again later.');
        setSnackbarColor('error');
        openSnackbar();
      }
    } finally {
      closeModal();
    }
  };

  return (
    <>
      <SolidButton color="error" sx={{ textTransform: 'none' }} onClick={openModal}>
        Delete Account
      </SolidButton>
      <Dialog
        open={isModalOpen}
        TransitionComponent={SlideTransition('up')}
        fullWidth
        maxWidth="sm"
        keepMounted
        onClose={closeModal}
        sx={{ textAlign: 'center' }}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Are you sure you delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <SolidButton
            size="medium"
            color="error"
            type="button"
            sx={{ textTransform: 'none', fontWeight: 600 }}
            onClick={handleDelete}
          >
            Delete Account
          </SolidButton>
          <SolidButton
            size="medium"
            color="primary"
            type="button"
            sx={{ textTransform: 'none', fontWeight: 600 }}
            onClick={closeModal}
          >
            Cancel
          </SolidButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

DeleteAccountButton.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }),
  openSnackbar: PropTypes.func.isRequired,
  setSnackbarColor: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};
