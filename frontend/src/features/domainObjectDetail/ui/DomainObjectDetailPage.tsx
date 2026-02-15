import { ArrowBack, UploadFile } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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
import { DomainObjectType } from '../../../api/workItems';
import { domainObjectTypeLabelMap } from '../../../shared/domain/labels';
import { QueryState } from '../../../shared/ui/QueryState';
import { useContextQuery, useUploadDocumentMutation } from '../api/queries';

type UploadForm = { fileName: string; mimeType: string; keywords: string };

export function DomainObjectDetailPage() {
  const params = useParams({ from: '/objects/$objectType/$objectId' });
  const objectType = params.objectType as DomainObjectType;
  const objectId = params.objectId;
  const contextQuery = useContextQuery(objectType, objectId);
  const uploadMutation = useUploadDocumentMutation(objectType, objectId);
  const [tab, setTab] = React.useState(0);
  const { control, handleSubmit, reset } = useForm<UploadForm>({
    defaultValues: { fileName: '', mimeType: 'application/pdf', keywords: '' },
  });

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

  if (contextQuery.isLoading || contextQuery.isError) {
    return (
      <QueryState
        isLoading={contextQuery.isLoading}
        isError={contextQuery.isError}
        loadingLabel="Fachobjekt wird geladen…"
      />
    );
  }

  if (!contextQuery.data)
    return <Typography>Kein Fachobjekt gefunden.</Typography>;

  return (
    <Stack spacing={3}>
      <Button component={Link} to="/" startIcon={<ArrowBack />}>
        Zur Übersicht
      </Button>
      <Card
        sx={{
          borderRadius: 4,
          background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
          color: '#fff',
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight={700}>
            {domainObjectTypeLabelMap[objectType]} · {contextQuery.data.title}
          </Typography>
          <Typography sx={{ opacity: 0.85 }}>
            {contextQuery.data.subtitle}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
            <Tab label="Aufgaben" />
            <Tab label="Dokumente" />
            <Tab label="Protokolle" />
          </Tabs>
          {tab === 0 && (
            <List>
              {contextQuery.data.tasks.map((task) => (
                <ListItem key={task.id} divider>
                  <ListItemText
                    primary={`${task.title} (${task.status})`}
                    secondary={`${task.assignedTo} · Fällig bis ${new Date(task.dueAt ?? '').toLocaleString('de-DE')}`}
                  />
                  <Link to="/work-items/$id" params={{ id: task.id ?? '' }}>
                    <Button>Öffnen</Button>
                  </Link>
                </ListItem>
              ))}
            </List>
          )}
          {tab === 1 && (
            <Stack spacing={2} mt={2}>
              <List>
                {contextQuery.data.documents.map((doc) => (
                  <ListItem key={doc.id} divider>
                    <ListItemText
                      primary={doc.fileName}
                      secondary={`${doc.mimeType} · ${doc.sizeInBytes} Bytes · Index: ${(doc.indexKeywords ?? []).join(', ')}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Box component="form" onSubmit={onSubmit}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Controller
                    name="fileName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Dateiname"
                        required
                        fullWidth
                      />
                    )}
                  />
                  <Controller
                    name="mimeType"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mime-Type"
                        required
                        sx={{ minWidth: 220 }}
                      />
                    )}
                  />
                  <Controller
                    name="keywords"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Index-Keywords (CSV)"
                        fullWidth
                      />
                    )}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<UploadFile />}
                    disabled={uploadMutation.isPending}
                  >
                    Upload + Indizierung
                  </Button>
                </Stack>
              </Box>
              {uploadMutation.isSuccess && (
                <Alert severity="success">
                  Dokument wurde hochgeladen und indiziert.
                </Alert>
              )}
            </Stack>
          )}
          {tab === 2 && (
            <List>
              {contextQuery.data.protocolEntries.map((entry) => (
                <ListItem key={entry.id} divider>
                  <ListItemText
                    primary={`${entry.source} · ${new Date(entry.timestamp ?? '').toLocaleString('de-DE')}`}
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
