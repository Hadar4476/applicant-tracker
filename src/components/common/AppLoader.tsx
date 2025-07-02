import { Box, CircularProgress, SxProps } from "@mui/material";

interface AppLoaderProps {
  sx?: SxProps;
}

const AppLoader = ({ sx }: AppLoaderProps) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={sx}>
      <CircularProgress />
    </Box>
  );
};

export default AppLoader;
