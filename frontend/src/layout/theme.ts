import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define the custom font
const customFont = {
  fontFamily: "'Montserrat', sans-serif",
  fontStyle: 'normal',
  fontWeight: 400,
  src: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap',
};

// Create a new theme with the custom font
const theme = createTheme({
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    h1: {
      fontWeight: 500,
      fontSize: '4.25rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '4rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '2.25rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
  },
});

export default theme;
