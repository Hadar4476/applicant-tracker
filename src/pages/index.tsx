import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "~/store/authStore";
import { CircularProgress, Box } from "@mui/material";

const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Don't redirect until the store is initialized
    if (!isInitialized || hasRedirected) {
      return;
    }

    setHasRedirected(true);

    // Redirect based on authentication status
    if (isAuthenticated) {
      router.replace("/dashboard");
    } else {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isInitialized, router, hasRedirected]);

  // Show loading while redirecting
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
};

export default HomePage;
