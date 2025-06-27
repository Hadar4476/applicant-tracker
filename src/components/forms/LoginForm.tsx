import { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Link,
  Typography,
  Stack,
} from "@mui/material";
import { api } from "../../utils/api";
import { useAuthStore } from "../../store/authStore";
import NextLink from "next/link";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      login(data.user, data.token);
      router.push("/dashboard");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setError(null);
    await loginMutation.mutateAsync(values);
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="w-full flex flex-col gap-4">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Field
            as={TextField}
            name="email"
            type="email"
            label="Email"
            fullWidth
            variant="outlined"
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
          />

          <Field
            as={TextField}
            name="password"
            type="password"
            label="Password"
            fullWidth
            variant="outlined"
            error={touched.password && !!errors.password}
            helperText={touched.password && errors.password}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isSubmitting || loginMutation.isLoading}
            sx={{ mt: 2 }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting || loginMutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>

          <Stack className="flex-row items-center justify-center gap-2">
            <Typography variant="body2">Don't have an account?</Typography>
            <NextLink href="/auth/register" passHref>
              <Link
                component="span"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up here
              </Link>
            </NextLink>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
