import { NextPage } from "next";
import Head from "next/head";
import AppDataTable from "~/components/common/AppDataTable";
import { api } from "~/utils/api";
import { MainLayout } from "~/components/layouts/MainLayout";

const JobsPage: NextPage = () => {
  const { data, isLoading, error } = api.jobs.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Dashboard - Jobs</title>
        <meta name="description" content="Manage jobs" />
      </Head>
      <MainLayout title="Jobs">
        <AppDataTable
          title="Jobs Table"
          description="Jobs Table"
          data={data?.jobs ?? []}
          config={{
            excludeKeys: ["id", "requirements", "advantages", "updatedAt"],
          }}
        />
      </MainLayout>
    </>
  );
};

export default JobsPage;
