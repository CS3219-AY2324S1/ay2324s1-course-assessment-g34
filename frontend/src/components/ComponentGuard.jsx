import { useAuthContext } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';

/**
 * Guards components by conditionally rendering them based on user authentication and roles.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The component or content to be rendered if the user is
 * authorized (required).
 * @param {string[]} props.allowedRoles - The roles allowed to access the component (required).
 * @param {React.ReactNode} props.altComponent - The component or content to be rendered if the
 * user is not authorized (optional).
 * @param {React.ReactNode} props.loadingComponent - The component or content to be rendered during
 * the loading state (optional).
 * @returns {React.ReactNode} The authorized component or alternate component based on user roles.
 * @example
 * // Usage in a React component
 * import { Role } from '@/utils/constants';
 * import ComponentGuard from '@/components/ComponentGuard';
 *
 * function MyProtectedComponent() {
 *   return (
 *     <ComponentGuard allowedRoles={[Role.ADMIN]}>
 *       {/* Content for authorized users goes here *\/}
 *     </ComponentGuard>
 *   );
 * }
 *
 * // Usage with an alternate component
 * function MyComponentWithAlternate() {
 *   return (
 *     <ComponentGuard allowedRoles={[Role.USER]} altComponent={<UnauthorizedMessage />}>
 *       {/* Content for authorized users goes here *\/}
 *     </ComponentGuard>
 *   );
 * }
 */
export default function ComponentGuard({
  children, allowedRoles, altComponent, loadingComponent,
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && allowedRoles.includes(user.role)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles]);

  if (isLoading) {
    return loadingComponent;
  }

  if (!isAuthorized && !isLoading) {
    return altComponent;
  }

  return isAuthorized && !isLoading && children;
}

/**
 * PropTypes for the ComponentGuard component.
 *
 * @type {Object}
 * @property {React.ReactNode} children - The component or content to be rendered if the user is
 * authorized (required).
 * @property {string[]} allowedRoles - The roles allowed to access the component (required).
 * @property {React.ReactNode} altComponent - The component or content to be rendered if the user
 * is not authorized (optional).
 * @param {React.ReactNode} props.loadingComponent - The component or content to be rendered during
 * the loading state (optional).
 */
ComponentGuard.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  altComponent: PropTypes.node,
  loadingComponent: PropTypes.node,
};
