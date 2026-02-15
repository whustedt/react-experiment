import { ArrowBack, UploadFile } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useParams } from '@tanstack/react-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useContextQuery, useUploadDocumentMutation, useWorkItemDetailQuery } from '../api/queries';

type UploadForm = {
  fileName: string;
  mimeType: string;
  keywords: string;
};

export function WorkItemDetailPage() {
  const { id } = useParams({ from: '/work-items/$id' });
  const { data, isLoading } = useWorkItemDetailQuery(id);
  const [tab, setTab] = React.useState(0);

  const { control, handleSubmit, reset } = useForm<UploadForm>({
    defaultValues: { fileName: '', mimeType: 'application/pdf', keywords: '' },
  });

  const contextQuery = useContextQuery(data?.objectType, data?.objectId);
  const uploadMutation = useUploadDocumentMutation(data?.objectType, data?.objectId);

  if (isLoading) return <Typography>Lädt…</Typography>;
  if (!data) return <Typography>Kein Datensatz gefunden.</Typography>;

  const onSubmit = handleSubmit(async (values) => {
    await uploadMutation.mutateAsync({
      fileName: values.fileName,
      mimeType: values.mimeType,
      sizeInBytes: Math.floor(Math.random() * 200000) + 5000,
      indexKeywords: values.keywords
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      uploadedBy: 'Alice',
    });
    reset({ fileName: '', mimeType: values.mimeType, keywords: '' });
  });

  return (
    <Stack spacing={2}>
      <Button component={Link} to="/" startIcon={<ArrowBack />}>
        Zurück zur Übersicht
      </Button>

      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              {data.title}
            </Typography>
            <Typography color="text.secondary">{data.description}</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={`Objekt: ${data.objectLabel}`} />
              <Chip label={`Typ: ${data.objectType}`} />
              <Chip label={`Status: ${data.status}`} color="primary" variant="outlined" />
              <Chip label={`Bearbeiter: ${data.assignedTo}`} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
            <Tab label="Aufgaben im Kontext" />
            <Tab label="Dokumente" />
            <Tab label="Fachprotokolle" />
          </Tabs>

          {contextQuery.isLoading && <Typography sx={{ mt: 2 }}>Kontext wird geladen…</Typography>}

          {contextQuery.data && tab === 0 && (
            <List>
              {contextQuery.data.tasks.map((task) => (
                <ListItem key={task.id} divider>
                  <ListItemText
                    primary={`${task.title} (${task.status})`}
                    secondary={`${task.objectLabel} · Fällig bis ${new Date(task.dueAt).toLocaleString('de-DE')}`}
                  />
                </ListItem>
              ))}
            </List>
          )}

          {contextQuery.data && tab === 1 && (
            <Stack spacing={2} mt={2}>
              <List>
                {contextQuery.data.documents.map((doc) => (
                  <ListItem key={doc.id} divider>
                    <ListItemText
                      primary={doc.fileName}
                      secondary={`${doc.mimeType} · ${doc.sizeInBytes} Bytes · Index: ${doc.indexKeywords.join(', ')}`}
                    />
                  </ListItem>
                ))}
              </List>

              <Box component="form" onSubmit={onSubmit}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Controller
                    name="fileName"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Dateiname" required fullWidth />}
                  />
                  <Controller
                    name="mimeType"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Mime-Type" required sx={{ minWidth: 220 }} />}
                  />
                  <Controller
                    name="keywords"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Index-Keywords (CSV)" fullWidth />}
                  />
                  <Button type="submit" variant="contained" startIcon={<UploadFile />} disabled={uploadMutation.isPending}>
                    Upload + Indizierung
                  </Button>
                </Stack>
              </Box>

              {uploadMutation.isSuccess && <Alert severity="success">Dokument wurde hochgeladen und indiziert.</Alert>}
            </Stack>
          )}

          {contextQuery.data && tab === 2 && (
            <List>
              {contextQuery.data.protocolEntries.map((entry) => (
                <ListItem key={entry.id} divider>
                  <ListItemText
                    primary={`${entry.source} · ${new Date(entry.timestamp).toLocaleString('de-DE')}`}
                    secondary={entry.message}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
