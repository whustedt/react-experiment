import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { Outlet } from '@tanstack/react-router';

export function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Workbasket</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
