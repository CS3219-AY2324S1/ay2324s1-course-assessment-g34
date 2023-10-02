import { LOGIN_SVC_URI, VERIFY_TOKEN_SVC_URI } from "@/config/uris";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { decode } from "jsonwebtoken";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

// handle login and logout here
export default function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (userData) => {
    try {
      const response = await axios.post(LOGIN_SVC_URI, userData);
      const { access_token, refresh_token } = response.data;
      const { user_role } = decode(accessToken);

      const newUser = {
        username: userData.username,
        userRole: user_role
      };

      setUser(newUser);
      setAccessToken(access_token);
      addRefreshToken(refresh_token);
      router.push("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.debug('Unauthorized: ', error.response.data);
        setError('The username or password you entered is incorrect');
      } else {
        console.debug('An error occurred: ', error);
        setError('An error occurred. Please try again later.');
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

  const removeAccessToken = () => {
    setAccessToken(null);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(REFRESH_TOKEN_SVC_URI, JSON.parse(getRefreshToken()));
      setAccessToken(response.data.access_token);
      const { username, user_role } = decode(accessToken);
      setUser({
        username: username,
        userRole: user_role
      });

    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.debug('Unauthorized: ', error.response.data);
      } else {
        console.debug('An error occurred: ', error);
        // redirect to error page
      }
    }
  };

  const verifyToken = async (token) => {
    try {
      const response = await axios.post(VERIFY_TOKEN_SVC_URI, token);
      return true;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.debug('Unauthorized: ', error.response.data);
        return false;
      } else {
        console.debug('An error occurred: ', error);
        // redirect to error page
      }
    }
  }

  const addRefreshToken = (refreshToken) => {
    Cookies.set('refresh', refreshToken, { secure: true });
  };

  const removeRefreshToken = () => {
    Cookies.remove('refresh');
  }

  const getRefreshToken = () => {
    return Cookies.get('refresh');
  }
  
  // TODO: abstract to checkAuthenticated
  useEffect(() => {
    if (accessToken && verifyToken(accessToken)) {
      setIsAuthenticated(true);
    }

    if (!user || !accessToken || !verifyToken(accessToken)) {
      const refreshToken = getRefreshToken();

      if (refreshToken && verifyToken(refreshToken)) {
        refreshAccessToken();
      }
    }

    setIsLoading(false);
  }, [user, accessToken]);

  return { user, setUser, accessToken, setAccessToken, login, logout, error, setError, removeAccessToken, refreshAccessToken, verifyToken, addRefreshToken, removeRefreshToken, getRefreshToken, isAuthenticated, isLoading };
}
