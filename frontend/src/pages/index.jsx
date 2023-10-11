import React from 'react';
import Layout from '@/components/Layout';

// TODO: Display page landing page if not authenticated
// if authenticated, display a dashboard
export default function Home() {
  return (
    <Layout>
      <h1>Welcome to PeerPrep</h1>
    </Layout>
  );
}
