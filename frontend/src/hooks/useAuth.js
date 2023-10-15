import { LOGIN_SVC_URI, VERIFY_TOKEN_SVC_URI, REFRESH_TOKEN_SVC_URI } from '@/config/uris';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { decode } from 'jsonwebtoken';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

/**
 * Custom hook for handling authentication and user data.
 *
 * @returns {Object} An object containing authentication-related functions and state.
 * @property {Object|null} user - The authenticated user's data, or null if not authenticated.
 * @property {boolean} isAuthenticated - A boolean indicating whether the user is authenticated.
 * @property {boolean} isLoading - A boolean indicating whether authentication data is being loaded.
 * @property {Function} login - Function to log in a user with provided credentials.
 * @property {Function} logout - Function to log out the user.
 * @property {string|null} loginError - An error message if login fails, or null if there's no
 * error.
 * @property {Function} setLoginError - Function to set the login error message.
 * @property {Function} setRedirect - Function to set the redirect URL after login.
 * @property {Function} getAccessToken - Function to retrieve and refresh the access token.
 */
export default function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirect, setRedirect] = useState('/');

  const addRefreshToken = (refreshToken) => {
    Cookies.set('refresh', refreshToken, { secure: true });
  };

  const removeRefreshToken = () => {
    Cookies.remove('refresh');
  };

  const getRefreshToken = () => Cookies.get('refresh');

  const removeAccessToken = () => {
    setAccessToken(null);
  };

  const addAccessToken = (token) => {
    setAccessToken(token);
  };

  const login = async (userData) => {
    try {
      const response = await axios.post(LOGIN_SVC_URI, userData);
      const { access, refresh } = response.data;
      const { user_role } = decode(access);

      const newUser = {
        username: userData.username,
        role: user_role,
      };
      setUser(newUser);
      addAccessToken(access);
      addRefreshToken(refresh);
      router.push(redirect);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.error('Unauthorized: ', err.response.data);
        setLoginError('The username or password you entered is incorrect');
      } else {
        console.error('An error occurred: ', err);
        setLoginError('An error occurred. Please try again later.');
      }
    }
  };

  const logout = () => {
    setUser(null);
    removeAccessToken();
    removeRefreshToken();
    // TODO: redirect to '/', which redirects to /login if not auth
    router.push('/login');
  };

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = getRefreshToken();
    let newAccessToken;
    if (!refreshToken) {
      return;
    }

    const body = { refresh: refreshToken };

    try {
      console.log('refreshing token...');
      const response = await axios.post(REFRESH_TOKEN_SVC_URI, body);
      const { access, refresh } = response.data;
      newAccessToken = access;
      addAccessToken(access);
      addRefreshToken(refresh);

      // KIV: not advisable to store user data in tokens, best to make another req to get user info
      const { username, user_role } = decode(refresh);

      setUser({
        username,
        role: user_role,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized: ', error);
      } else {
        // TODO: redirect to error page
        console.error('An error occurred: ', error);
      }
    }

    return newAccessToken;
  }, []);

  const verifyAccessToken = useCallback(async () => {
    const body = { token: accessToken };

    try {
      const response = await axios.post(VERIFY_TOKEN_SVC_URI, body);

      if (response && response.status === 200) {
        addAccessToken(accessToken);
        return true;
      }
    } catch (err) {
      removeAccessToken();
    }

    return false;
  }, [accessToken]);

  const verifyAndRefreshAccessToken = useCallback(async () => {
    const isValid = accessToken && await verifyAccessToken();

    if (!isValid) {
      await refreshAccessToken();
    }
    setIsLoading(false);
  }, [accessToken, refreshAccessToken, verifyAccessToken]);

  const getAccessToken = async () => {
    const isValid = accessToken && await verifyAccessToken();

    if (isValid) {
      return accessToken;
    }

    return refreshAccessToken();
  };

  // resolve user
  useEffect(() => {
    verifyAndRefreshAccessToken();
  }, []);

  return {
    user,
    isAuthenticated: !!accessToken,
    isLoading,
    login,
    logout,
    loginError,
    setLoginError,
    setRedirect,
    getAccessToken,
  };
}
