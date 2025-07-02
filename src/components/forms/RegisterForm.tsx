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
import { api } from "~/utils/api";
import { useAuthStore } from "~/store/authStore";
import NextLink from "next/link";

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .trim()
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .trim()
    .required("Password is required"),
});

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const RegisterForm = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const registerMutation = api.auth.register.useMutation({
    onSuccess: (data) => {
      login(data.user, data.token);
      router.push("/dashboard");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    setError(null);
    const { confirmPassword, ...registerData } = values;
    await registerMutation.mutateAsync(registerData);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="w-full flex flex-col gap-4">
          {error && <Alert severity="error">{error}</Alert>}

          <Field
            as={TextField}
            name="name"
            type="text"
            label="Full Name"
            fullWidth
            variant="outlined"
            error={touched.name && !!errors.name}
            helperText={touched.name && errors.name}
          />

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

          <Field
            as={TextField}
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            fullWidth
            variant="outlined"
            error={touched.confirmPassword && !!errors.confirmPassword}
            helperText={touched.confirmPassword && errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isSubmitting || registerMutation.isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting || registerMutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>

          <Stack className="flex-row items-center justify-center gap-2">
            <Typography variant="body2">Already have an account?</Typography>
            <NextLink href="/auth/login" passHref>
              <Link
                component="span"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in here
              </Link>
            </NextLink>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
