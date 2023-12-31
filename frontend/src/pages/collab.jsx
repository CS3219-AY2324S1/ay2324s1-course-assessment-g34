import RouteGuard from '@/components/RouteGuard';
import { Role } from '@/utils/constants';
import { Skeleton } from '@mui/material';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

// use of dynamic imports to avoid SSR hydration issues
const DynamicCollabPage = dynamic(() => import('../components/CollabPage/CollabPage'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height="100vh" />,
});

export default function CollaborationPage() {
  return (
    <>
      <RouteGuard allowedRoles={[Role.USER, Role.ADMIN]}>
        <Head>
          <title>PeerPrep</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="PeerPrep is a technical interview preparation platform where students can find peers to practise interview questions together" />
        </Head>
        <DynamicCollabPage />
      </RouteGuard>
    </>
  );
}
