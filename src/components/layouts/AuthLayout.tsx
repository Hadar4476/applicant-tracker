import { ReactNode } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import { AuthGuard } from "../AuthGuard";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 2,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                className="font-bold text-gray-800"
              >
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {title === "Sign In"
                  ? "Welcome back! Please sign in to your account."
                  : "Create your account to get started."}
              </Typography>
            </Box>
            {children}
          </Paper>
        </Container>
      </Box>
    </AuthGuard>
  );
};
