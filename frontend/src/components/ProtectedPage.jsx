import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProtectedPage({ children, allowedRoles }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuthContext();

  const checkAuthorized = () => {
    if (allowedRoles.includes(user.role)) {
      setIsAuthorized(true);
    } else {
      // TODO: redirect to permission denied page
      router.replace("/")
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }

    if (!isLoading && isAuthenticated && !isAuthorized) {
      checkAuthorized();
    }
  }, []);

  return isAuthenticated && isAuthorized && !isLoading && children;
}