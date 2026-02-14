import { ArrowBack } from '@mui/icons-material';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { Link, useParams } from '@tanstack/react-router';
import { useWorkItemDetailQuery } from '../api/queries';

export function WorkItemDetailPage() {
  const { id } = useParams({ from: '/work-items/$id' });
  const { data, isLoading } = useWorkItemDetailQuery(id);

  if (isLoading) {
    return <Typography>Lädt…</Typography>;
  }

  if (!data) {
    return <Typography>Kein Datensatz gefunden.</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Button component={Link} to="/" startIcon={<ArrowBack />}>
        Zurück
      </Button>
      <Typography variant="h5">Work Item {data.id}</Typography>
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography>Kunde: {data.customerName}</Typography>
            <Typography>Vertrag: {data.contractNo}</Typography>
            <Typography>Typ: {data.type}</Typography>
            <Typography>Status: {data.status}</Typography>
            <Typography>Priorität: {data.priority}</Typography>
            <Typography>Eingang: {data.receivedAt}</Typography>
            <Typography>Zuständig: {data.assignedTo}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
