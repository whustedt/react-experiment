import { Link, Outlet } from '@tanstack/react-router';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';

export function AppShell() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Quarkus + React Work Items
          </Typography>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
            Worklist
          </Link>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
