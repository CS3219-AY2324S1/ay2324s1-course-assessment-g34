import { Skeleton } from '@mui/material';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from "react"

const DynamicCollabPage = dynamic(() => import('../components/CollabPage/CollabPage'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" height="100vh" />
})

export default function CollaborationPage() {
  
  return (
    <>
      <Head>
        <title>PeerPrep</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="PeerPrep is a technical interview preparation platform where students can find peers to practise interview questions together" />
      </Head>
      <DynamicCollabPage />
    </>
  );
}