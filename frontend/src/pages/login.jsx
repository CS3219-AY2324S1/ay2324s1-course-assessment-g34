import SolidButton from '@/components/SolidButton';
import React, { useState } from 'react';
import {
  Box, Container, Grid, Paper, TextField, Typography,
} from '@mui/material';
import { Bree_Serif } from 'next/font/google';
import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';

const breeSerif = Bree_Serif({ subsets: ['latin'], weight: '400' });

/**
 * LoginPage component for user login.
 *
 * @component
 * @example
 * // Usage within another React component
 * import LoginPage from './LoginPage';
 * // ...
 * <LoginPage />
 *
 * @returns {JSX.Element} The rendered LoginPage component.
 */
export default function LoginPage() {
  const { login, loginError, setLoginError } = useAuthContext();
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const resetAllErrors = () => {
    setLoginError(null);
    setUsernameError(null);
    setPasswordError(null);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    resetAllErrors();
    const userData = new FormData(event.currentTarget);
    const username = userData.get('username').trim();
    const password = userData.get('password');

    const errors = [];

    if (!username) {
      const emptyUsernameError = 'Username cannot be empty.';
      errors.push(emptyUsernameError);
      setUsernameError(emptyUsernameError);
    }

    if (!password) {
      const emptyPasswordError = 'Password cannot be empty.';
      errors.push(emptyPasswordError);
      setPasswordError(emptyPasswordError);
    }

    if (errors.length > 0) {
      return;
    }

    const newUserData = {
      username,
      password,
    };

    login(newUserData);
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
            Sign In
          </Typography>
          <Box component="form" noValidate onSubmit={handleLogin} sx={{ p: 4 }}>
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
                <SolidButton
                  fullWidth
                  variant="contained"
                  size="medium"
                  color="secondary"
                  type="submit"
                  sx={{ textTransform: 'none', fontWeight: 600, mt: 2 }}
                >
                  Log In
                </SolidButton>
              </Grid>
              {loginError
              && (
                <Grid item xs={12}>
                  <Typography sx={{ color: (theme) => theme.palette.error.main, fontSize: 12 }}>
                    {loginError}
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
          Don&apos;t have an account?
          {' '}
          <Typography
            component="span"
            color="secondary"
            sx={{ fontWeight: 600, ':hover': { textDecoration: 'underline' } }}
          >
            <Link href="/signup">Sign up</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
