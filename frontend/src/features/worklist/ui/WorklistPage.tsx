import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Fade,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Link } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { BasketScope, DomainObjectType, WorkItemStatus } from '../../../api/workItems';
import { useWorklistQuery } from '../api/queries';

const filterSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE']).or(z.literal('')).default(''),
  colleague: z.string().optional(),
  globalQuery: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const statusColorMap: Record<WorkItemStatus, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  OPEN: 'warning',
  IN_PROGRESS: 'info',
  BLOCKED: 'error',
  DONE: 'success',
};

const basketLabels: Record<BasketScope, string> = {
  MY: 'Meine Aufgaben',
  TEAM: 'Teamkorb',
  COLLEAGUE: 'Kollegenkorb',
};

export function WorklistPage() {
  const { control, handleSubmit, watch } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { status: '', colleague: '', globalQuery: '' },
  });

  const [basket, setBasket] = React.useState<BasketScope>(BasketScope.MY);
  const [filters, setFilters] = React.useState<FilterFormValues>({ status: '', colleague: '', globalQuery: '' });
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({ page: 0, pageSize: 6 });

  const query = useWorklistQuery({
    page: paginationModel.page,
    size: paginationModel.pageSize,
    q: filters.globalQuery || undefined,
    status: (filters.status || undefined) as WorkItemStatus | undefined,
    basket,
    colleague: basket === 'COLLEAGUE' ? filters.colleague : undefined,
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.8 },
    { field: 'title', headerName: 'Aufgabe', flex: 1.6 },
    { field: 'customerName', headerName: 'Kunde', flex: 1.1 },
    { field: 'objectLabel', headerName: 'Fachobjekt', flex: 1.1 },
    {
      field: 'objectType',
      headerName: 'Typ',
      flex: 0.7,
      valueFormatter: (value: DomainObjectType) =>
        value === 'CUSTOMER' ? 'Kunde' : value === 'CONTRACT' ? 'Vertrag' : 'Schaden',
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      renderCell: (params) => <Chip label={params.value} color={statusColorMap[params.value as WorkItemStatus]} size="small" />,
    },
    {
      field: 'open',
      headerName: 'Aktionen',
      sortable: false,
      flex: 1.3,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Link to="/work-items/$id" params={{ id: params.row.id }}>
            <Button size="small" startIcon={<OpenInNewIcon />}>
              Aufgabe
            </Button>
          </Link>
          <Link to="/objects/$objectType/$objectId" params={{ objectType: params.row.objectType, objectId: params.row.objectId }}>
            <Button size="small" startIcon={<VisibilityIcon />}>
              Objekt
            </Button>
          </Link>
        </Stack>
      ),
    },
  ];

  const onSubmit = (values: FilterFormValues) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setFilters(values);
  };

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Arbeitskörbe
        </Typography>
        <Typography color="text.secondary">Schalte zwischen deinen Aufgaben, dem Teamkorb und einzelnen Kollegenkörben um.</Typography>
      </Stack>

      <Card sx={{ backdropFilter: 'blur(4px)' }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              1) Korbsicht
            </Typography>
            <ToggleButtonGroup
              color="primary"
              exclusive
              value={basket}
              onChange={(_, next) => {
                if (!next) return;
                setPaginationModel((prev) => ({ ...prev, page: 0 }));
                setBasket(next);
              }}
              sx={{ flexWrap: 'wrap' }}
            >
              <ToggleButton value="MY">Meine Aufgaben</ToggleButton>
              <ToggleButton value="TEAM">Teamkorb</ToggleButton>
              <ToggleButton value="COLLEAGUE">Kollegenkorb</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                2) Globale Bestandssuche (separat)
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                <Controller
                  name="globalQuery"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Bestand durchsuchen" fullWidth placeholder="Kunde, Vertrag, Schaden, Notiz..." />}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Status" sx={{ minWidth: 180 }}>
                      <MenuItem value="">Alle</MenuItem>
                      <MenuItem value="OPEN">OPEN</MenuItem>
                      <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                      <MenuItem value="BLOCKED">BLOCKED</MenuItem>
                      <MenuItem value="DONE">DONE</MenuItem>
                    </TextField>
                  )}
                />
                <Fade in={basket === 'COLLEAGUE'}>
                  <Box sx={{ minWidth: basket === 'COLLEAGUE' ? 220 : 0, display: basket === 'COLLEAGUE' ? 'block' : 'none' }}>
                    <Controller
                      name="colleague"
                      control={control}
                      render={({ field }) => <TextField {...field} label="Kollege" fullWidth placeholder="z.B. Bob" />}
                    />
                  </Box>
                </Fade>
                <Button type="submit" variant="contained" startIcon={<SearchIcon />}>
                  Aktualisieren
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {basket === 'COLLEAGUE' && !watch('colleague') && (
        <Alert severity="info">Wähle einen Kollegen, damit der Kollegenkorb geladen werden kann.</Alert>
      )}

      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="subtitle1" fontWeight={600}>
              {basketLabels[basket]}
            </Typography>
            <DataGrid
              autoHeight
              rows={query.data?.items ?? []}
              columns={columns}
              loading={query.isLoading}
              paginationMode="server"
              rowCount={query.data?.total ?? 0}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[6, 12, 24]}
              disableRowSelectionOnClick
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
