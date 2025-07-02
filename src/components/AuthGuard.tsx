import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "~/store/authStore";
import AppLoader from "./common/AppLoader";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard = ({
  children,
  requireAuth = true,
  redirectTo = "/dashboard",
}: AuthGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, isLoading } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for the store to be initialized
    if (!isInitialized) {
      return;
    }

    setIsReady(true);

    const handleAuth = () => {
      if (requireAuth && !isAuthenticated) {
        // User needs to be authenticated but isn't
        if (!router.pathname.startsWith("/auth")) {
          router.replace("/auth/login");
        }
      } else if (!requireAuth && isAuthenticated) {
        // User is authenticated but trying to access auth pages
        router.replace(redirectTo);
      }
    };

    // Add a small delay to prevent immediate redirects on page load
    const timer = setTimeout(handleAuth, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isInitialized, requireAuth, router, redirectTo]);

  // Show loading while store is initializing or during auth checks
  if (!isInitialized || isLoading || !isReady) {
    return <AppLoader sx={{ minHeight: "100vh" }} />;
  }

  // Handle redirects - show loading during redirect
  if (requireAuth && !isAuthenticated && !router.pathname.startsWith("/auth")) {
    return <AppLoader sx={{ minHeight: "100vh" }} />;
  }

  if (!requireAuth && isAuthenticated && router.pathname.startsWith("/auth")) {
    return <AppLoader sx={{ minHeight: "100vh" }} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
