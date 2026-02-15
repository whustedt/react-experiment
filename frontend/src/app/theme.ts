import { createTheme } from '@mui/material';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#1f3d73',
    },
    secondary: {
      main: '#2e4f87',
    },
    background: {
      default: '#f4f6fb',
    },
  },
  shape: {
    borderRadius: 12,
  },
});
