import { Alert, CircularProgress, Stack, Typography } from '@mui/material';

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  loadingLabel?: string;
  errorLabel?: string;
}

export function QueryState({
  isLoading,
  isError,
  loadingLabel = 'Daten werden geladen…',
  errorLabel = 'Ein Fehler ist aufgetreten. Bitte später erneut versuchen.',
}: QueryStateProps) {
  if (isLoading) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
        <Typography color="text.secondary">{loadingLabel}</Typography>
      </Stack>
    );
  }

  if (isError) {
    return <Alert severity="error">{errorLabel}</Alert>;
  }

  return null;
}
