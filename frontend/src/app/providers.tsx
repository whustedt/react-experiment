import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { deDE } from '@mui/material/locale';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';

const queryClient = new QueryClient();
const theme = createTheme(
  {
    palette: {
      primary: { main: '#3158d5' },
      secondary: { main: '#6749c6' },
      background: { default: '#eef2ff' },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            border: '1px solid rgba(96, 109, 164, 0.15)',
            boxShadow: '0 10px 30px rgba(28, 53, 129, 0.08)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600 },
        },
      },
    },
  },
  deDE,
);

export function AppProviders() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
