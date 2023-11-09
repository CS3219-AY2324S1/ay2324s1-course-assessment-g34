import Layout from '@/components/Layout';
import React from 'react';
import { CircularProgress, Stack, Typography } from '@mui/material';

export default function LoadingPage() {
  return (
    <Layout>
      <Stack
        sx={{
          height: '100vh',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        rowGap={2}
      >
        <CircularProgress size={80} />
        <Typography>Loading...</Typography>
      </Stack>
    </Layout>
  );
}
