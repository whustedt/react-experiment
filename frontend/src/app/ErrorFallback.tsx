import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

interface ErrorFallbackProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorFallback({ title = 'Unerwarteter Fehler', message, actionLabel = 'Erneut versuchen', onAction }: ErrorFallbackProps) {
  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error" icon={<ReportProblemOutlinedIcon />}>
        <Stack spacing={1}>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
          <Typography variant="body2">{message}</Typography>
          {onAction ? (
            <Box>
              <Button color="error" variant="outlined" size="small" onClick={onAction}>
                {actionLabel}
              </Button>
            </Box>
          ) : null}
        </Stack>
      </Alert>
    </Box>
  );
}
