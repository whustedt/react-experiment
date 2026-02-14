import { Link, useParams } from '@tanstack/react-router';
import { Alert, CircularProgress, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { useWorkItemDetailQuery } from '../api/queries';

export default function WorkItemDetailPage() {
  const { id } = useParams({ from: '/work-items/$id' });
  const { data, isLoading, isError } = useWorkItemDetailQuery(id);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError || !data) {
    return <Alert severity="error">Work Item konnte nicht geladen werden.</Alert>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Work Item {data.id}</Typography>
      <Paper>
        <List>
          <ListItem>
            <ListItemText primary="Kunde" secondary={data.customerName} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Contract" secondary={data.contractNo} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Typ" secondary={data.type} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Status" secondary={data.status} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Priorität" secondary={data.priority} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Empfangen" secondary={data.receivedAt} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Zugewiesen an" secondary={data.assignedTo} />
          </ListItem>
        </List>
      </Paper>
      <Link to="/">Zurück zur Liste</Link>
    </Stack>
  );
}
