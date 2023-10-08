import SolidButton from '@/components/SolidButton';
import {
  Box, Container, Grid, Paper, TextField, Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Bree_Serif } from 'next/font/google';
import Link from 'next/link';
import { validateConfirmPassword, validatePassword, validateUsername } from '@/utils/validation';
import axios from 'axios';
import { REGISTER_SVC_URI } from '@/config/uris';
import { useRouter } from 'next/router';

const breeSerif = Bree_Serif({ subsets: ['latin'], weight: '400' });
const MAX_USERNAME_LENGTH = 60;

export default function SignUpPage() {
  const router = useRouter();
  const [generalError, setGeneralError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const resetAllErrors = () => {
    setGeneralError(null);
    setUsernameError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    resetAllErrors();
    const userData = new FormData(event.currentTarget);
    const username = userData.get('username').trim();
    const password = userData.get('password');
    const confirmPassword = userData.get('confirmPassword');

    const errors = [];

    const usernameValidationError = validateUsername(username);
    const passwordValidationError = validatePassword(password);
    const confirmPasswordValidationError = validateConfirmPassword(confirmPassword, password);

    if (usernameValidationError) {
      errors.push(usernameValidationError);
      setUsernameError(usernameValidationError);
    }

    if (passwordValidationError) {
      errors.push(passwordValidationError);
      setPasswordError(passwordValidationError);
    }

    if (confirmPasswordValidationError) {
      errors.push(confirmPasswordValidationError);
      setConfirmPasswordError(confirmPasswordValidationError);
    }

    if (errors.length > 0) {
      return;
    }

    try {
      // TODO: handle duplicate usernames more elegantly
      const newUserData = {
        username,
        password,
      };

      await axios.post(REGISTER_SVC_URI, newUserData);

      router.push('/login');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Bad Request: ', error.response.data);
        // duplicate user name
        setUsernameError(error.response.data.username);
      } else {
        console.error('An error occurred: ', error);
        setGeneralError('Registration failed. Please try again later.');
      }
    }
  };

  return (
    <Container
      component="main"
      sx={{
        bgcolor: (theme) => theme.palette.primary.dark,
        display: 'flex',
        justifyContent: 'center',
      }}
      maxWidth="100vw"
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '350px',
        minHeight: '100vh',
        gap: 2,
      }}
      >
        <Typography
          variant="h4"
          noWrap
          component="h1"
          sx={{
            mb: 1,
            fontFamily: breeSerif.style,
            letterSpacing: '.1rem',
            color: (theme) => theme.palette.success.main,
            textDecoration: 'none',
          }}
        >
          PeerPrep
        </Typography>
        <Box
          component={Paper}
          elevation={4}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Typography
            variant="h5"
            noWrap
            component="h1"
            color="primary"
            sx={{ mt: 2, textAlign: 'center', fontWeight: 'bold' }}
          >
            Sign Up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSignup} sx={{ p: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  size="small"
                  margin="dense"
                  id="username"
                  name="username"
                  label="Username"
                  type="text"
                  fullWidth
                  error={usernameError != null}
                  helperText={usernameError}
                  onChange={() => setUsernameError(null)}
                  autoComplete="username"
                  inputProps={{ maxLength: MAX_USERNAME_LENGTH }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  size="small"
                  margin="dense"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  error={passwordError != null}
                  helperText={passwordError}
                  onChange={() => setPasswordError(null)}
                  autoComplete="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  size="small"
                  margin="dense"
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  inputProps={{ maxLength: MAX_USERNAME_LENGTH }}
                  fullWidth
                  error={confirmPasswordError != null}
                  helperText={confirmPasswordError}
                  onChange={() => setConfirmPasswordError(null)}
                />
              </Grid>
              <Grid item xs={12}>
                <SolidButton
                  fullWidth
                  variant="contained"
                  size="medium"
                  color="secondary"
                  type="submit"
                  sx={{ textTransform: 'none', fontWeight: 600, mt: 2 }}
                >
                  Sign Up
                </SolidButton>
              </Grid>
              {generalError
              && (
                <Grid item xs={12}>
                  <Typography sx={{ color: (theme) => theme.palette.error.main, fontSize: 12 }}>
                    {generalError}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
        <Box
          component={Paper}
          elevation={4}
          sx={{
            px: 4, py: 3, width: '100%', textAlign: 'center',
          }}
        >
          Have an account?
          {' '}
          <Typography
            component="span"
            color="secondary"
            sx={{ fontWeight: 600, ':hover': { textDecoration: 'underline' } }}
          >
            <Link href="/login">Log in</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
