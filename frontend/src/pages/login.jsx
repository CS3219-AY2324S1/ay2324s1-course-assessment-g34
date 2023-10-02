import SolidButton from '@/components/SolidButton';
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Box, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { Bree_Serif } from 'next/font/google';
import Link from 'next/link';
import axios from 'axios';
import { LOGIN_SVC_URI } from '@/config/uris';
import { useAuthContext } from '@/contexts/AuthContext';

const breeSerif = Bree_Serif({ subsets: ['latin'], weight: '400' });

export default function LoginPage() {
  const { login, error, setError } = useAuthContext();
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const resetAllErrors = () => {
    setError(null);
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
      const emptyUsernameError = "Username cannot be empty.";
      errors.push(emptyUsernameError);
      setUsernameError(emptyUsernameError);
    }

    if (!password) {
      const emptyPasswordError = "Password cannot be empty.";
      errors.push(emptyPasswordError);
      setPasswordError(emptyPasswordError);
    }

    if (errors.length > 0) {
      return;
    }

    const newUserData = {
      username: username,
      password: password
    };

    login(newUserData);

    // try {
    //   const newUserData = {
    //     username: username,
    //     password: password
    //   };

    //   const response = await axios.post(LOGIN_SVC_URI, newUserData);

    //   // store refresh token in secure HttpOnly Cookie
    //   Cookies.set('refresh', refresh_token);
    //   router.push("/");
    // } catch (error) {
    //   if (error.response && error.response.status === 401) {
    //     console.debug('Unauthorized: ', error.response.data);
    //     setGeneralError('The username or password you entered is incorrect');
    //   } else {
    //     console.debug('An error occurred: ', error);
    //     setGeneralError('An error occurred. Please try again later.');
    //   }
    // }
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
              {error
              && (
                <Grid item xs={12}>
                  <Typography sx={{ color: (theme) => theme.palette.error.main, fontSize: 12 }}>
                    {error}
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
          Don't have an account?
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