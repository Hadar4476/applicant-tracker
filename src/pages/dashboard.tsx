import { NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "../components/layouts/MainLayout";
import { Paper, Typography, Grid, Card, CardContent, Box } from "@mui/material";
import { useAuthStore } from "../store/authStore";

const DashboardPage: NextPage = () => {
  const { user } = useAuthStore();

  return (
    <>
      <Head>
        <title>Dashboard - Your App</title>
        <meta name="description" content="User dashboard" />
      </Head>
      <MainLayout>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            className="font-bold text-gray-800"
          >
            Welcome to your Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Hello {user?.name}, here's what's happening today.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Profile Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Name:</strong> {user?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {user?.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Member since:</strong>{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This is where you can display user statistics, metrics, or
                    other relevant information.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Display recent user activities, notifications, or updates
                    here.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </MainLayout>
    </>
  );
};

export default DashboardPage;
