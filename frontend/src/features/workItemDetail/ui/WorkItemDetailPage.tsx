import { ArrowBack, CheckCircle, ForwardToInbox, PlayArrow, Snooze } from '@mui/icons-material';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Grow,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useParams } from '@tanstack/react-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useApplyWorkItemActionMutation, useWorkItemDetailQuery } from '../api/queries';

type ActionFormValues = {
  assignee: string;
  reminderAt: string;
};

export function WorkItemDetailPage() {
  const { id } = useParams({ from: '/work-items/$id' });
  const { data, isLoading } = useWorkItemDetailQuery(id);
  const actionMutation = useApplyWorkItemActionMutation(id, data?.objectType, data?.objectId);
  const { control, getValues } = useForm<ActionFormValues>({
    defaultValues: {
      assignee: '',
      reminderAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    },
  });

  if (isLoading) return <Typography>Lädt…</Typography>;
  if (!data) return <Typography>Kein Datensatz gefunden.</Typography>;

  const runAction = async (action: 'START' | 'FORWARD' | 'RESCHEDULE' | 'COMPLETE') => {
    const values = getValues();
    await actionMutation.mutateAsync({
      action,
      assignee: values.assignee || undefined,
      reminderAt: values.reminderAt ? new Date(values.reminderAt).toISOString() : undefined,
    });
  };

  return (
    <Stack spacing={2}>
      <Button component={Link} to="/" startIcon={<ArrowBack />}>
        Zurück zur Korbsicht
      </Button>

      <Grow in>
        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              <Typography variant="h5" fontWeight={700}>
                {data.title}
              </Typography>
              <Typography color="text.secondary">{data.description}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={`Status: ${data.status}`} color="primary" variant="outlined" />
                <Chip label={`Bearbeiter: ${data.assignedTo}`} />
                <Chip label={`Fällig: ${new Date(data.dueAt).toLocaleString('de-DE')}`} />
              </Stack>
              <Link to="/objects/$objectType/$objectId" params={{ objectType: data.objectType, objectId: data.objectId }}>
                <Button sx={{ alignSelf: 'flex-start' }}>Fachobjekt öffnen</Button>
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </Grow>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Aufgabe bearbeiten</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Controller
                name="assignee"
                control={control}
                render={({ field }) => <TextField {...field} label="Weiterleiten an" placeholder="Kollegin/Kollege" fullWidth />}
              />
              <Controller
                name="reminderAt"
                control={control}
                render={({ field }) => <TextField {...field} label="Wiedervorlage" type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth />}
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <Button variant="contained" startIcon={<PlayArrow />} onClick={() => runAction('START')} disabled={actionMutation.isPending}>
                Starten
              </Button>
              <Button variant="contained" color="secondary" startIcon={<ForwardToInbox />} onClick={() => runAction('FORWARD')} disabled={actionMutation.isPending}>
                Weiterleiten
              </Button>
              <Button variant="outlined" startIcon={<Snooze />} onClick={() => runAction('RESCHEDULE')} disabled={actionMutation.isPending}>
                Wiedervorlage
              </Button>
              <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={() => runAction('COMPLETE')} disabled={actionMutation.isPending}>
                Abschließen
              </Button>
            </Stack>

            {actionMutation.isSuccess && <Alert severity="success">Aktion erfolgreich ausgeführt.</Alert>}
            {actionMutation.isError && <Alert severity="error">Aktion fehlgeschlagen.</Alert>}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
