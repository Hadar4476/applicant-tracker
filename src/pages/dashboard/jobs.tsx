import { Box } from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import PostsTable from "~/components/common/PostTable";
import { MainLayout } from "~/components/layouts/MainLayout";

const JobsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard - Jobs</title>
        <meta name="description" content="Manage jobs" />
      </Head>
      <MainLayout title="Jobs">
        <PostsTable />
      </MainLayout>
    </>
  );
};

export default JobsPage;
