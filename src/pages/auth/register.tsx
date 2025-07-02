import { NextPage } from "next";
import Head from "next/head";
import { AuthLayout } from "~/components/layouts/AuthLayout";
import { RegisterForm } from "~/components/forms/RegisterForm";

const RegisterPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Account - Your App</title>
        <meta name="description" content="Create your account" />
      </Head>
      <AuthLayout title="Create Account">
        <RegisterForm />
      </AuthLayout>
    </>
  );
};

export default RegisterPage;
