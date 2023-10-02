import '@/styles/globals.css';
import { ThemeProvider } from '@mui/material/styles';
import Head from 'next/head';
import React from 'react';
import { PropTypes } from 'prop-types';
import { theme } from '@/theme';
import { AuthProvider } from '@/contexts/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>PeerPrep</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="PeerPrep is a technical interview preparation platform where students can find peers to practise interview questions together" />
      </Head>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};
