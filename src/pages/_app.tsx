import { type AppType } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "~/components/AuthProvider";
import { api } from "~/utils/api";
import "~/styles/globals.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div id="__next">
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
