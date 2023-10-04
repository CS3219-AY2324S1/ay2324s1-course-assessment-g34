import { LOGIN_SVC_URI, VERIFY_TOKEN_SVC_URI, REFRESH_TOKEN_SVC_URI } from '@/config/uris';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { decode } from 'jsonwebtoken';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
        console.debug('Unauthorized: ', err.response.data);
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
    // setIsAuthenticated(false);
    // TODO: redirect to '/', which redirects to /login if not auth
    router.push('/login');
  };

  const refreshAccessToken = async () => {
    setIsLoading(true);
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return;
    }

    const body = { refresh: refreshToken };

    try {
      const response = await axios.post(REFRESH_TOKEN_SVC_URI, body);
      const { access, refresh } = response.data;

      addAccessToken(access);
      addRefreshToken(refresh);

      // KIV: not advisable to store user data in tokens, best to make another req to get user info
      const { username, user_role } = decode(refresh);

      setUser({
        username: username,
        role: user_role,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized: ', error.response.data);
      } else {
        // TODO: redirect to error page
        console.error('An error occurred: ', error);
      }
    }
  };

  const verifyAccessToken = async () => {
    setIsLoading(true);

    const body = { token: accessToken };

    try {
      const response = await axios.post(VERIFY_TOKEN_SVC_URI, body);

      if (response && response.status == 200) {
        addAccessToken(accessToken);
      }
    } catch (err) {
      removeAccessToken();
      console.error('An error occurred: ', err);
    }
  };

  const getAccessToken = () => {
    if (accessToken) {
      verifyAccessToken();
    }

    if (!accessToken) {
      refreshAccessToken();
    }

    return accessToken;
  }

  // resolve user
  useEffect(() => {
    getAccessToken();
    setIsLoading(false);
  }, [accessToken]);

  return {
    user,
    isAuthenticated: !!accessToken,
    isLoading,
    login,
    logout,
    loginError,
    setLoginError,
    setRedirect
  };
}
