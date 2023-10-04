import { useAuthContext } from '@/contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// guards routes/pages by redirecting user AND conditional rendering 
export default function RouteGuard({ children, allowedRoles }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { user, isAuthenticated, isLoading, setRedirect } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && allowedRoles.includes(user.role)) {
        setIsAuthorized(true);
        return;
      }
      
      if (!isAuthenticated) {
        setRedirect(router.asPath);
      }

      setIsAuthorized(false);
    }
  }, [isLoading, isAuthenticated, user, allowedRoles]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex' }}>
        Please&nbsp;
        <Typography
          component="span"
          color="secondary"
          sx={{ fontWeight: 600, ':hover': { textDecoration: 'underline' } }}
        >
          <Link href="/login">log in</Link>
        </Typography>
        &nbsp;to view this page.
      </Box>
    );
  }

  if (isAuthenticated && !isAuthorized) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Typography>
          You are not authorized to view this page.
        </Typography>
      </Box>
    );
  }

  return isAuthorized && children;
}
