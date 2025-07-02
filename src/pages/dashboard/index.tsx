import { NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "~/components/layouts/MainLayout";
import { Typography, Card, CardContent, Box } from "@mui/material";
import { useAuthStore } from "~/store/authStore";

const DashboardPage: NextPage = () => {
  const { user } = useAuthStore();

  return (
    <>
      <Head>
        <title>Dashboard - Your App</title>
        <meta name="description" content="User dashboard" />
      </Head>
      <MainLayout title="Dashboard">
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
        </Box>
      </MainLayout>
    </>
  );
};

export default DashboardPage;
