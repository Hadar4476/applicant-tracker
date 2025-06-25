import { NextPage } from "next";
import Head from "next/head";
import { AuthLayout } from "../../components/layouts/AuthLayout";
import { LoginForm } from "../../components/forms/LoginForm";

const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign In - Your App</title>
        <meta name="description" content="Sign in to your account" />
      </Head>
      <AuthLayout title="Sign In">
        <LoginForm />
      </AuthLayout>
    </>
  );
};

export default LoginPage;
