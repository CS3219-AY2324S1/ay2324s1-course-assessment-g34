import { LOGIN_SVC_URI, VERIFY_TOKEN_SVC_URI, REFRESH_TOKEN_SVC_URI } from '@/config/uris';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { decode } from 'jsonwebtoken';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
      console.log("logging in...");
      setUser(newUser);
      addAccessToken(access);
      addRefreshToken(refresh);
      router.push(redirect);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 404)) {
        setLoginError('The username or password you entered is incorrect.');
      } else {
        console.error('An error occurred: ', err);
        setLoginError('An error occurred. Please try again later.');
      }
    }
  };

  const logout = () => {
    console.log("logging out...")
    setUser(null);
    removeAccessToken();
    removeRefreshToken();
    // TODO: redirect to '/', which needs to /login if not auth
    router.push('/login');
  };

  const refreshAccessToken = useCallback(async () => {
    setIsLoading(true);
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(REFRESH_TOKEN_SVC_URI, { refresh: refreshToken });
      const { access, refresh } = response.data;
      addAccessToken(access);
      addRefreshToken(refresh);
      
      const { username, user_role } = decode(access);

      if (!user || user.username !== username || user.role !== user_role ) {
        setUser({ username, role: user_role });
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.error('Unauthorized: ', err);
        logout();
      } else {
        console.error('An error occurred: ', err);
      }
    }
    setIsLoading(false);
  }, [user]);

  const verifyAccessToken = async () => {
    const body = { token: accessToken };

    try {
      await axios.post(VERIFY_TOKEN_SVC_URI, body);
    } catch (err) {
      removeAccessToken();
    }
  };

  const prepareToken = async () => {
    if (!accessToken) {
      await refreshAccessToken();
      return;
    }

    await verifyAccessToken();

    if (!accessToken) {
      await refreshAccessToken();
    }
  };

  useEffect(() => {
    if (!user) {
      refreshAccessToken();
    }
  }, [user, refreshAccessToken]);

  return {
    user,
    accessToken,
    prepareToken,
    isLoading,
    login,
    logout,
    loginError,
    setLoginError,
    setRedirect,
  };
}
