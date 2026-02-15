import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Link } from '@tanstack/react-router';

export function RouteErrorComponent() {
  return (
    <Alert severity="error">
      Unerwarteter Fehler beim Laden der Seite. Bitte die URL prüfen und erneut
      versuchen.
    </Alert>
  );
}

export function RouteNotFoundComponent() {
  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h5" fontWeight={700}>
        Seite nicht gefunden
      </Typography>
      <Typography color="text.secondary">
        Die angeforderte Route existiert nicht oder wurde verschoben.
      </Typography>
      <Box>
        <Button component={Link} to="/" variant="contained">
          Zur Startseite
        </Button>
      </Box>
    </Stack>
  );
}
