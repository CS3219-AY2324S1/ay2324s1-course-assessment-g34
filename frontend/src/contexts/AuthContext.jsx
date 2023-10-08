import useAuth from '@/hooks/useAuth';
import React, { createContext, useContext } from 'react';
import { PropTypes } from 'prop-types';

const AuthContext = createContext();

const useAuthContext = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuthContext, AuthProvider };

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
