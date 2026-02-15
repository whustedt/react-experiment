import { createTheme } from '@mui/material';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#2e4f87',
      dark: '#1b2a4b',
    },
    secondary: {
      main: '#5b6ee1',
    },
    background: {
      default: '#f4f6fb',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    h6: {
      fontWeight: 700,
    },
  },
});
