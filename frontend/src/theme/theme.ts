import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1d5173',
      dark: '#143a52',
      light: '#4a7590',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ca840a',
      dark: '#8d5c07',
      light: '#d59d3b',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
    },
      text: {
      primary: '#1a1a1a',
      secondary: '#4a4a4a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
