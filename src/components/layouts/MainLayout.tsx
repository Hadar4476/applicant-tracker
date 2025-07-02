import { ReactNode } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Stack,
} from "@mui/material";
import { AccountCircle, ExitToApp } from "@mui/icons-material";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { AuthGuard } from "../AuthGuard";
import { api } from "../../utils/api";
import AppDrawer from "../common/AppDrawer";

interface MainLayoutProps {
  title: string;
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const logoutMutation = api.auth.logout.useMutation();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      logout();
      handleClose();
    } catch (error) {
      // Handle error if needed
      logout(); // Logout locally even if API call fails
      handleClose();
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <Box className="min-h-screen flex">
        <AppDrawer />

        <Box className="flex-1">
          <AppBar position="static" className="bg-blue-600">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2">Welcome, {user?.name}</Typography>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: "primary.dark" }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <AccountCircle sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ExitToApp sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </AppBar>
          <main className="flex-1 p-6">
            <Container maxWidth="lg">{children}</Container>
          </main>
        </Box>
      </Box>
    </AuthGuard>
  );
};
