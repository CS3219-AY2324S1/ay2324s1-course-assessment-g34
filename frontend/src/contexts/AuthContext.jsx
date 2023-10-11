import useAuth from '@/hooks/useAuth';
import React, { createContext, useContext } from 'react';
import { PropTypes } from 'prop-types';

const AuthContext = createContext();

/**
 * A custom hook for accessing the authentication context.
 *
 * @returns {Object} An object containing authentication-related functions and state.
 */
const useAuthContext = () => useContext(AuthContext);

/**
 * Context provider for managing authentication state and providing authentication-related
 * functions to components.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to be wrapped by the AuthProvider.
 * @returns {JSX.Element} The JSX element representing the AuthProvider.
 */
function AuthProvider({ children }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuthContext, AuthProvider };

/**
 * PropTypes for the AuthProvider component.
 *
 * @type {Object}
 * @property {ReactNode} children - The child components to be wrapped by the AuthProvider
 * (required).
 */
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
