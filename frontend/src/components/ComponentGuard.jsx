import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

// guards components by hiding them from unauthenticated or unauthorised users
// altComponent is displayed if user is not authenticated or does not have the required roles
export default function ComponentGuard({ children, allowedRoles, altComponent }) {
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

  return isAuthorized ? children : altComponent;
}
