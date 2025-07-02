import { ReactNode } from "react";
import { Container, Paper, Stack, Typography } from "@mui/material";
import AuthGuard from "../AuthGuard";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <main
        className="min-h-screen flex flex-col items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Container className="max-w-xl">
          <Paper
            className="p-8 rounded-lg"
            elevation={8}
            sx={{
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack className="items-center gap-3">
              <Stack className="w-full items-center gap-3">
                <Typography
                  variant="h4"
                  component="h1"
                  className="font-bold text-gray-800"
                >
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {title === "Sign In"
                    ? "Welcome back! Please sign in to your account."
                    : "Create your account to get started."}
                </Typography>
              </Stack>
              {children}
            </Stack>
          </Paper>
        </Container>
      </main>
    </AuthGuard>
  );
};
