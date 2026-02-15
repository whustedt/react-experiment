import { ArrowBack } from '@mui/icons-material';
import { Button, Card, CardContent, Chip, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { Link, useParams } from '@tanstack/react-router';
import { DomainObjectType } from '../../../api/workItems';
import { useContextQuery } from '../../workItemDetail/api/queries';

export function DomainObjectPage() {
  const { objectType, objectId } = useParams({ from: '/objects/$objectType/$objectId' });
  const query = useContextQuery(objectType as DomainObjectType, objectId);

  if (query.isLoading) return <Typography>Lädt Fachobjekt…</Typography>;
  if (!query.data) return <Typography>Kein Fachobjekt gefunden.</Typography>;

  return (
    <Stack spacing={2}>
      <Button component={Link} to="/" startIcon={<ArrowBack />}>
        Zurück zum Arbeitskorb
      </Button>

      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              {query.data.title}
            </Typography>
            <Typography color="text.secondary">{query.data.subtitle}</Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={`Typ: ${query.data.objectType}`} />
              <Chip label={`Objekt-ID: ${query.data.objectId}`} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Aufgaben zum Fachobjekt
          </Typography>
          <List>
            {query.data.tasks.map((task) => (
              <ListItem key={task.id} divider>
                <ListItemText
                  primary={`${task.title} (${task.status})`}
                  secondary={`Bearbeiter: ${task.assignedTo} · Fällig: ${new Date(task.dueAt ?? '').toLocaleString('de-DE')}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Dokumente zum Fachobjekt
          </Typography>
          <List>
            {query.data.documents.map((doc) => (
              <ListItem key={doc.id} divider>
                <ListItemText
                  primary={doc.fileName}
                  secondary={`${doc.mimeType} · ${doc.sizeInBytes} Bytes · ${(doc.indexKeywords ?? []).join(', ')}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Protokolle zum Fachobjekt
          </Typography>
          <List>
            {query.data.protocolEntries.map((entry) => (
              <ListItem key={entry.id} divider>
                <ListItemText
                  primary={`${entry.source} · ${new Date(entry.timestamp ?? '').toLocaleString('de-DE')}`}
                  secondary={entry.message}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
}
