import {
  Alert, Container, Divider, Grid, IconButton, Paper, Snackbar, Stack, Switch, TextField,
  Typography,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useAuthContext } from '@/contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_SVC_URI } from '@/config/uris';
import { validateDisplayName } from '@/utils/validation';
import { useRouter } from 'next/router';
import LoadingPage from '@/pages/loading';
import SolidButton from '../SolidButton';
import DeleteAccountButton from './DeleteAccountButton';
import ProfileHeader from './ProfileHeader';
import Layout from '../Layout';

const label = { inputProps: { 'aria-label': 'Dark mode switch' } };

export default function ProfilePage() {
  const path = useRouter().asPath;
  const {
    getAccessToken, user, logout, setRedirect,
  } = useAuthContext();
  const [displayName, setDisplayName] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState(null);
  const [newDisplayName, setNewDisplayName] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarColor, setSnackbarColor] = useState('error');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  const openSnackbar = () => {
    setIsSnackbarOpen(true);
  };

  const resetError = () => {
    setEditError(null);
  };

  const fetchUserDetails = async () => {
    try {
      const token = await getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${USER_SVC_URI}/${user.username}`, config);
      /* eslint-disabled camelcase */
      setDisplayName(response.data.profile.displayed_name);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setMessage('You must be logged in to view this profile.');
        setSnackbarColor('error');
        openSnackbar();
        setRedirect(path);
        setTimeout(() => logout(), 2000);
      } else if (err.response && err.response.status === 403) {
        setMessage('You do not have permissions to view this profile.');
        setSnackbarColor('error');
        openSnackbar();
      } else if (err.response && err.response.status === 404) {
        setMessage('The profile you are trying to view does not exist.');
        setSnackbarColor('error');
        openSnackbar();
      } else {
        setMessage('An error occurred. Please try again later.');
        setSnackbarColor('error');
        openSnackbar();
      }
    }
  };

  const handleDisplayNameChange = (e) => {
    const { value } = e.target;
    resetError();
    setNewDisplayName(value);
  };

  const enableEditMode = () => {
    setNewDisplayName(displayName);
    setIsEditing(true);
  };

  const disableEditMode = () => {
    setIsEditing(false);
    resetError();
  };

  const handleEditDisplayName = async (e) => {
    e.preventDefault();
    const updatedDisplayName = newDisplayName.trim();

    const error = validateDisplayName(updatedDisplayName);

    if (error) {
      setEditError(error);
      return;
    }

    try {
      const token = await getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      /* eslint-disable camelcase  */
      const response = await axios.put(`${USER_SVC_URI}/${user.username}`, { displayed_name: updatedDisplayName }, config);
      /* eslint-disable camelcase  */
      setDisplayName(response.data.displayed_name);
      disableEditMode();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setEditError('Invalid display name.');
      } else if (err.response && err.response.status === 401) {
        setEditError('You must be logged in to edit this account.');
        setRedirect(path);
        setTimeout(() => logout(), 2000);
      } else if (err.response && err.response.status === 403) {
        setEditError('You do not have permissions to edit this account.');
      } else if (err.response && err.response.status === 404) {
        setEditError('The account you are trying to delete does not exist.');
      } else {
        console.error(err);
        setEditError('An error occurred. Please try again later.');
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Layout>
      <Container
        maxWidth="xl"
        sx={{
          height: '100%', my: 2, display: 'flex', justifyContent: 'center',
        }}
      >
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={isSnackbarOpen}
          autoHideDuration={5000}
          key="topcenter"
        >
          <Alert severity={snackbarColor} onClose={closeSnackbar} variant="filled" elevation={6}>{message}</Alert>
        </Snackbar>
        <Stack gap={2} sx={{ maxWidth: 700 }}>
          <ProfileHeader displayName={displayName} username={user.username} />
          <Grid container component={Paper} sx={{ p: 3 }} rowGap={3}>
            <Grid item xs={12}>
              <Grid container sx={{ alignItems: { xs: 'start', sm: 'center' } }} rowGap={1}>
                <Grid item xs={12}>
                  <Typography sx={{
                    fontWeight: 600, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden',
                  }}
                  >
                    Account Information
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Grid container rowGap={1}>
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        Display name
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8} component="form" noValidate id="editDisplayName">
                      {isEditing
                        ? (
                          <>
                            <TextField
                              required
                              size="small"
                              value={newDisplayName}
                              margin="dense"
                              name="displayName"
                              type="text"
                              error={editError !== null}
                              helperText={editError}
                              onChange={handleDisplayNameChange}
                              autoComplete="username"
                            />
                            <Stack direction="row" columnGap={1}>
                              <SolidButton
                                size="small"
                                color="success"
                                type="submit"
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                                onClick={handleEditDisplayName}
                              >
                                Save
                              </SolidButton>
                              <SolidButton
                                size="small"
                                color="grey"
                                type="button"
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                                onClick={disableEditMode}
                              >
                                Cancel
                              </SolidButton>
                            </Stack>
                          </>
                        )
                        : (
                          <Typography color={(theme) => theme.palette.primary.light} sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            {displayName}
                          </Typography>
                        )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'right' }}>
                  { !isEditing
                      && (
                      <IconButton size="small" onClick={enableEditMode}>
                        <Edit fontSize="small" />
                      </IconButton>
                      )}
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={10}>
                  <Grid container rowGap={1}>
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        Username
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography color={(theme) => theme.palette.primary.light} sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {user.username}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container sx={{ alignItems: 'center' }} rowGap={1}>
                <Grid item xs={12}>
                  <Typography sx={{
                    fontWeight: 600, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden',
                  }}
                  >
                    Preferences
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Typography sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    Dark mode
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'right' }}>
                  <Switch {...label} color="secondary" />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <DeleteAccountButton
                    user={user}
                    openSnackbar={openSnackbar}
                    setSnackbarColor={setSnackbarColor}
                    setMessage={setMessage}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Layout>
  );
}
