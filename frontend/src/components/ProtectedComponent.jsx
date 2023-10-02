import useAuth from "@/hooks/useAuth";
import { Container } from "@mui/material";
import jwtDecode from "jwt-decode";
import React, { useState } from "react";

export default function ProtectedComponent({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const { user, accessToken } = useAuth();

  const decodedToken = jwtDecode(accessToken);
  const isAuthorised = decodedToken.user_role == "admin";

  if (isLoading) {
     // replace with mui loading component
    return <Container component="h1">Loading...</Container>
  }

  return isAuthorised && (
    <>{children}</>
  );
}