import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { Outlet } from '@tanstack/react-router';

export function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6fb' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(90deg, #1b2a4b, #2e4f87)' }}>
        <Toolbar sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 1.5 }}>
          <Typography variant="h6" fontWeight={700}>
            Smart Workbasket
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Aufgaben, Fachobjekte und Dokumente in einer modernen Kontextsicht.
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
