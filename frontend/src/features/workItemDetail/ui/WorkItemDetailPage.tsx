import React from 'react';
import { ArrowBack, CloudUpload } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useParams } from '@tanstack/react-router';
import { useWorkItemDetailQuery } from '../api/queries';

type ContextTab = 'tasks' | 'documents' | 'protocols';

type FachobjektType = 'KUNDE' | 'VERTRAG' | 'SCHADEN';

interface IndexedDocument {
  id: string;
  fileName: string;
  documentType: string;
  keywords: string;
}

function deriveFachobjektType(type: string): FachobjektType {
  if (type.toLowerCase().includes('schaden')) {
    return 'SCHADEN';
  }

  if (type.toLowerCase().includes('vertrag')) {
    return 'VERTRAG';
  }

  return 'KUNDE';
}

export function WorkItemDetailPage() {
  const { id } = useParams({ from: '/work-items/$id' });
  const { data, isLoading } = useWorkItemDetailQuery(id);
  const [tab, setTab] = React.useState<ContextTab>('tasks');

  const [documents, setDocuments] = React.useState<IndexedDocument[]>([
    { id: 'DOC-101', fileName: 'Schadensmeldung.pdf', documentType: 'Meldung', keywords: 'Unfall, Erstmeldung' },
    { id: 'DOC-102', fileName: 'Police-2024.pdf', documentType: 'Vertrag', keywords: 'Tarif, Laufzeit' },
  ]);

  const [uploadFileName, setUploadFileName] = React.useState('');
  const [documentType, setDocumentType] = React.useState('Allgemein');
  const [keywords, setKeywords] = React.useState('');

  if (isLoading) {
    return <Typography>Lädt…</Typography>;
  }

  if (!data) {
    return <Typography>Kein Datensatz gefunden.</Typography>;
  }

  const fachobjektType = deriveFachobjektType(data.type);
  const contextKey = fachobjektType === 'KUNDE' ? data.customerName : fachobjektType === 'VERTRAG' ? data.contractNo : data.id;

  const handleIndexDocument = () => {
    if (!uploadFileName) {
      return;
    }

    setDocuments((prev) => [
      {
        id: `DOC-${Math.floor(Math.random() * 1000)}`,
        fileName: uploadFileName,
        documentType,
        keywords,
      },
      ...prev,
    ]);

    setUploadFileName('');
    setDocumentType('Allgemein');
    setKeywords('');
  };

  return (
    <Stack spacing={2.5}>
      <Button component={Link} to="/" startIcon={<ArrowBack />} sx={{ alignSelf: 'flex-start' }}>
        Zurück zur Aufgabenliste
      </Button>

      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h5">Kontextsicht Fachobjekt</Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={fachobjektType} color="primary" />
              <Chip label={`Kontext: ${contextKey}`} variant="outlined" />
              <Chip label={`Aufgabe: ${data.id}`} variant="outlined" />
            </Stack>
            <Typography color="text.secondary">
              Aufgaben können auf Kunde, Vertrag oder Schaden liegen. Diese Sicht bündelt Aufgaben, Dokumente und Fachprotokolle.
            </Typography>
            <Divider sx={{ py: 0.5 }} />
            <Typography>Kunde: {data.customerName}</Typography>
            <Typography>Vertrag: {data.contractNo}</Typography>
            <Typography>Status: {data.status}</Typography>
            <Typography>Zuständig: {data.assignedTo}</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <Tabs value={tab} onChange={(_, value: ContextTab) => setTab(value)}>
          <Tab value="tasks" label="Aufgaben" />
          <Tab value="documents" label="Dokumente" />
          <Tab value="protocols" label="Fachprotokolle" />
        </Tabs>
        <CardContent>
          {tab === 'tasks' && (
            <List>
              <ListItem>
                <ListItemText
                  primary={`Hauptaufgabe ${data.id}`}
                  secondary={`Status ${data.status} · Prio ${data.priority} · Eingang ${data.receivedAt}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Folgeaufgabe: Rückfrage an Kunden" secondary="Typ: Kunde · Status: OPEN" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Folgeaufgabe: Vertragsprüfung" secondary="Typ: Vertrag · Status: IN_PROGRESS" />
              </ListItem>
            </List>
          )}

          {tab === 'documents' && (
            <Stack spacing={2}>
              <Typography variant="h6">Upload & Indizierung</Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Button component="label" variant="outlined" startIcon={<CloudUpload />}>
                  Datei auswählen
                  <input
                    hidden
                    type="file"
                    onChange={(event) => setUploadFileName(event.target.files?.[0]?.name ?? '')}
                  />
                </Button>
                <TextField label="Dateiname" value={uploadFileName} onChange={(event) => setUploadFileName(event.target.value)} fullWidth />
                <TextField select label="Dokumenttyp" value={documentType} onChange={(event) => setDocumentType(event.target.value)} sx={{ minWidth: 200 }}>
                  <MenuItem value="Allgemein">Allgemein</MenuItem>
                  <MenuItem value="Meldung">Meldung</MenuItem>
                  <MenuItem value="Vertrag">Vertrag</MenuItem>
                  <MenuItem value="Korrespondenz">Korrespondenz</MenuItem>
                </TextField>
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="Schlagworte / Index"
                  value={keywords}
                  onChange={(event) => setKeywords(event.target.value)}
                  fullWidth
                />
                <Button variant="contained" onClick={handleIndexDocument}>
                  Dokument indizieren
                </Button>
              </Stack>

              <Divider />
              <List>
                {documents.map((document) => (
                  <ListItem key={document.id} divider>
                    <ListItemText
                      primary={`${document.fileName} (${document.documentType})`}
                      secondary={`ID ${document.id} · Index: ${document.keywords || '—'}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
          )}

          {tab === 'protocols' && (
            <Box>
              <Typography paragraph>13:22 · Regelprüfung Vertrag erfolgreich durchgeführt.</Typography>
              <Typography paragraph>13:20 · Dokumentenindex aktualisiert.</Typography>
              <Typography paragraph>13:18 · Schadenkontext mit Kundenakte synchronisiert.</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
