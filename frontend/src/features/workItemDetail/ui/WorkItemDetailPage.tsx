import { ArrowBack, PlayArrow, TaskAlt, Update, West } from '@mui/icons-material';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useParams } from '@tanstack/react-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DomainObjectType, WorkItemActionType } from '../../../api/workItems';
import { useWorkItemActionMutation, useWorkItemDetailQuery } from '../api/queries';

type ActionForm = {
  action: WorkItemActionType;
  assignee: string;
  followUpAt: string;
  comment: string;
};

const objectTypeLabelMap: Record<DomainObjectType, string> = {
  CUSTOMER: 'Kunde',
  CONTRACT: 'Vertrag',
  CLAIM: 'Schaden',
};

export function WorkItemDetailPage() {
  const { id } = useParams({ from: '/work-items/$id' });
  const { data, isLoading } = useWorkItemDetailQuery(id);
  const actionMutation = useWorkItemActionMutation(id);

  const form = useForm<ActionForm>({
    defaultValues: {
      action: WorkItemActionType.START,
      assignee: '',
      followUpAt: '',
      comment: '',
    },
  });

  const selectedAction = form.watch('action');

  if (isLoading) return <Typography>Lädt…</Typography>;
  if (!data) return <Typography>Kein Datensatz gefunden.</Typography>;

  const onSubmit = form.handleSubmit(async (values) => {
    await actionMutation.mutateAsync({
      action: values.action,
      assignee: values.action === WorkItemActionType.FORWARD ? values.assignee : undefined,
      followUpAt: values.action === WorkItemActionType.RESCHEDULE && values.followUpAt ? new Date(values.followUpAt).toISOString() : undefined,
      comment: values.comment || undefined,
    });
    form.reset({ ...values, comment: '' });
  });

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1}>
        <Button component={Link} to="/" startIcon={<ArrowBack />}>
          Zur Übersicht
        </Button>
        <Link to="/objects/$objectType/$objectId" params={{ objectType: data.objectType, objectId: data.objectId }}>
          <Button startIcon={<West />} color="inherit">
            Zum Fachobjekt
          </Button>
        </Link>
      </Stack>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h4" fontWeight={700}>
              {data.title}
            </Typography>
            <Typography color="text.secondary">{data.description}</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={`Status: ${data.status}`} color="primary" />
              <Chip label={`Bearbeiter: ${data.assignedTo}`} />
              <Chip label={`${objectTypeLabelMap[data.objectType]}: ${data.objectLabel}`} />
              <Chip label={`Fällig am: ${new Date(data.dueAt).toLocaleDateString('de-DE')}`} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4, transition: 'all 180ms ease', '&:hover': { boxShadow: 6 } }}>
        <CardContent>
          <Typography variant="h6" mb={2} fontWeight={700}>
            Aufgabensteuerung
          </Typography>
          <Stack component="form" spacing={2} onSubmit={onSubmit}>
            <Controller
              name="action"
              control={form.control}
              render={({ field }) => (
                <TextField {...field} select label="Aktion" fullWidth>
                  <MenuItem value={WorkItemActionType.START}>Starten</MenuItem>
                  <MenuItem value={WorkItemActionType.FORWARD}>Weiterleiten</MenuItem>
                  <MenuItem value={WorkItemActionType.RESCHEDULE}>Wiedervorlage</MenuItem>
                  <MenuItem value={WorkItemActionType.COMPLETE}>Abschließen</MenuItem>
                </TextField>
              )}
            />

            {selectedAction === WorkItemActionType.FORWARD && (
              <Controller
                name="assignee"
                control={form.control}
                rules={{ required: 'Bitte Zielbearbeiter eintragen.' }}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Weiterleiten an" error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />
                )}
              />
            )}

            {selectedAction === WorkItemActionType.RESCHEDULE && (
              <Controller
                name="followUpAt"
                control={form.control}
                rules={{ required: 'Bitte Wiedervorlagedatum wählen.' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="datetime-local"
                    label="Wiedervorlage"
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            )}

            <Controller name="comment" control={form.control} render={({ field }) => <TextField {...field} multiline minRows={2} label="Kommentar" />} />

            <Button
              type="submit"
              variant="contained"
              startIcon={
                selectedAction === WorkItemActionType.START ? <PlayArrow /> : selectedAction === WorkItemActionType.COMPLETE ? <TaskAlt /> : <Update />
              }
              disabled={actionMutation.isPending}
            >
              Aktion ausführen
            </Button>
          </Stack>

          {actionMutation.isSuccess && <Alert severity="success" sx={{ mt: 2 }}>Aufgabe wurde aktualisiert.</Alert>}
        </CardContent>
      </Card>
    </Stack>
  );
}
