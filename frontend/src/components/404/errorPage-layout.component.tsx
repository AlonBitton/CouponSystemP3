import { Box, Typography, useTheme } from '@mui/material';
import useTitle from 'hooks/useTitle';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';

const ErrorPage: FC = () => {
  const theme = useTheme();
  useTitle("Error 404 | Page not found!")

  return (
    <Box p={4} height="100vh" alignItems="center" flexDirection="column" justifyContent="center" display="flex">
      <Box maxWidth={350}>
        <img src="/static/errorPage.svg" width="100%" alt="Error 404" />
      </Box>
      <Typography fontSize={64} fontWeight={700} color="primary.main" mt={3}>
        Ooops... 404!
      </Typography>
      <Typography color="text.disabled" fontWeight="600">
        The page you requested could not be found.
      </Typography>

      <NavLink
        to="/dashboard"
        style={{
          display: 'block',
          marginTop: '1.5rem',
          fontSize: 20,
          fontWeight: 700,
          textDecoration: 'underline',
          color: theme.palette.primary.main,
        }}
      >
        Back to Home Page
      </NavLink>
    </Box>
  );
};

export default ErrorPage;
