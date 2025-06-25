import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    // Initialize auth state when the app starts
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  return <>{children}</>;
};
