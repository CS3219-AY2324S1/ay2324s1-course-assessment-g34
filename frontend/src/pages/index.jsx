import React from 'react';
import Layout from '@/components/Layout';
import { NAVBAR_HEIGHT_PX } from '@/utils/constants';
import { Stack, Typography } from '@mui/material';

// TODO: Display page landing page if not authenticated
// if authenticated, display a dashboard
export default function Home() {
  return (
    <Layout>
      <Stack
        sx={{
          height: `calc(100vh - ${NAVBAR_HEIGHT_PX}px)`,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        rowGap={2}
      >
        <Typography component="h3" variant='h3'>Welcome to PeerPrep</Typography>
      </Stack>
    </Layout>
  );
}
