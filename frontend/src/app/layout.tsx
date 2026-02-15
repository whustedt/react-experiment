import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { Outlet } from '@tanstack/react-router';

export function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(100deg, #14244a, #3158d5 60%, #6749c6)' }}>
        <Toolbar sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 1.5 }}>
          <Typography variant="h6" fontWeight={700}>
            Smart Workbasket
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.88 }}>
            Klare Arbeitskorbsicht, Aufgaben-Details und 360° Fachobjektkontext.
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
