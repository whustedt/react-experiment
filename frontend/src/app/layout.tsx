import { AssignmentTurnedIn, ManageSearch } from '@mui/icons-material';
import { AppBar, Box, Container, Stack, Toolbar, Typography } from '@mui/material';
import { Outlet } from '@tanstack/react-router';

export function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <AssignmentTurnedIn color="primary" />
            <Box>
              <Typography variant="h6" color="text.primary">
                Insurance Task Hub
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <ManageSearch fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  Arbeitskorb · Bestandssuche · Kontextsicht
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }} maxWidth="lg">
        <Outlet />
      </Container>
    </Box>
  );
}
