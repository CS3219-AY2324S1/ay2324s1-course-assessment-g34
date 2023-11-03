import RouteGuard from '@/components/RouteGuard';
import { useAuthContext } from '@/contexts/AuthContext';
import { Role } from '@/utils/constants';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';
import LoadingPage from './loading';

const DynamicProfilePage = dynamic(() => import('../components/ProfilePage/ProfilePage'), {
  ssr: false,
  loading: () => <LoadingPage />,
});

export default function Profile() {
  const { user } = useAuthContext();

  return (
    <RouteGuard allowedRoles={[Role.ADMIN, Role.USER]}>
      <Head>
        <title>{user ? user.username : 'Profile'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={`Profile and collaboration history of ${user}`} />
      </Head>
      <DynamicProfilePage />
    </RouteGuard>
  );
}
