import { useAuthContext } from '@/contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';

/**
 * Guards routes/pages by redirecting users and providing conditional rendering based on their
 * roles.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered within the guard
 * (required).
 * @param {string[]} props.allowedRoles - The roles allowed to access the route (required).
 * @returns {React.ReactNode} The content to be rendered within the guard, or a redirect message.
 * @example
 * // Usage in a Next.js page
 * import { Role } from '@/utils/constants';
 * import RouteGuard from '@/components/RouteGuard';
 *
 * function MyProtectedPage() {
 *   return (
 *     <RouteGuard allowedRoles={[Role.ADMIN, Role.USER]}>
 *       {/* Content for authorized users goes here *\/}
 *     </RouteGuard>
 *   );
 * }
 *
 * export default MyProtectedPage;
 */
export default function RouteGuard({ children, allowedRoles }) {
  const path = useRouter().asPath;
  const [isAuthorized, setIsAuthorized] = useState(false);
  const {
    user, isAuthenticated, isLoading, setRedirect,
  } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && allowedRoles.includes(user.role)) {
        setIsAuthorized(true);
        return;
      }

      if (!isAuthenticated) {
        setRedirect(path);
      }

      setIsAuthorized(false);
    }
  }, [isLoading, isAuthenticated, user, path, allowedRoles, setRedirect]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

/**
 * PropTypes for the RouteGuard component.
 *
 * @type {Object}
 * @property {React.ReactNode} children - The content to be rendered within the guard (required).
 * @property {string[]} allowedRoles - The roles allowed to access the route (required).
 */
RouteGuard.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
