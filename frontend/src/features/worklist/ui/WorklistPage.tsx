import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
} from '@mui/x-data-grid';
import { Link } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { appEnv } from '../../../app/config/env';
import {
  BasketScope,
  DomainObjectType,
  WorkItemStatus,
} from '../../../api/workItems';
import {
  domainObjectTypeLabelMap,
  workItemStatusColorMap,
} from '../../../shared/domain/labels';
import { useGlobalWorkItemSearchQuery, useWorklistQuery } from '../api/queries';

const basketFilterSchema = z.object({
  status: z
    .enum(['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE'])
    .or(z.literal(''))
    .default(''),
  colleague: z.string().optional(),
});
const globalSearchSchema = z.object({
  q: z.string().min(2, 'Bitte mindestens 2 Zeichen eingeben.'),
  status: z
    .enum(['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE'])
    .or(z.literal(''))
    .default(''),
});

type BasketFilterFormValues = z.infer<typeof basketFilterSchema>;
type GlobalSearchFormValues = z.infer<typeof globalSearchSchema>;

const basketTabs: {
  value: BasketScope;
  label: string;
  icon: React.ReactElement;
}[] = [
  {
    value: BasketScope.MY,
    label: 'Meine Aufgaben',
    icon: <PersonSearchIcon />,
  },
  { value: BasketScope.TEAM, label: 'Teamkorb', icon: <WorkspacesIcon /> },
  {
    value: BasketScope.COLLEAGUE,
    label: 'Kollegenkorb',
    icon: <PersonSearchIcon />,
  },
];

export function WorklistPage() {
  const [basket, setBasket] = React.useState<BasketScope>(BasketScope.MY);
  const [basketFilters, setBasketFilters] =
    React.useState<BasketFilterFormValues>({ status: '', colleague: '' });
  const [globalFilters, setGlobalFilters] =
    React.useState<GlobalSearchFormValues | null>(null);
  const [basketPaginationModel, setBasketPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: appEnv.defaultPageSize,
    });
  const [globalPaginationModel, setGlobalPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: appEnv.defaultPageSize,
    });

  const basketForm = useForm<BasketFilterFormValues>({
    resolver: zodResolver(basketFilterSchema),
    defaultValues: { status: '', colleague: '' },
  });
  const globalForm = useForm<GlobalSearchFormValues>({
    resolver: zodResolver(globalSearchSchema),
    defaultValues: { q: '', status: '' },
  });

  const basketQuery = useWorklistQuery({
    page: basketPaginationModel.page,
    size: basketPaginationModel.pageSize,
    status: (basketFilters.status || undefined) as WorkItemStatus | undefined,
    basket,
    colleague:
      basket === BasketScope.COLLEAGUE ? basketFilters.colleague : undefined,
  });

  const globalSearchQuery = useGlobalWorkItemSearchQuery(
    {
      page: globalPaginationModel.page,
      size: globalPaginationModel.pageSize,
      q: globalFilters?.q ?? '',
      status: (globalFilters?.status || undefined) as
        | WorkItemStatus
        | undefined,
    },
    Boolean(globalFilters?.q),
  );

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.8 },
    { field: 'title', headerName: 'Aufgabe', flex: 1.4 },
    { field: 'customerName', headerName: 'Kunde', flex: 1.1 },
    { field: 'objectLabel', headerName: 'Fachobjekt', flex: 1.1 },
    {
      field: 'objectType',
      headerName: 'Typ',
      flex: 0.8,
      valueFormatter: (value: DomainObjectType) =>
        domainObjectTypeLabelMap[value] ?? value,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.9,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={workItemStatusColorMap[params.value as WorkItemStatus]}
          size="small"
        />
      ),
    },
    { field: 'assignedTo', headerName: 'Bearbeiter', flex: 0.9 },
    {
      field: 'open',
      headerName: 'Aktion',
      sortable: false,
      flex: 1.3,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Link to="/work-items/$id" params={{ id: String(params.row.id) }}>
            <Button size="small" startIcon={<OpenInNewIcon />}>
              Aufgabe
            </Button>
          </Link>
          <Link
            to="/objects/$objectType/$objectId"
            params={{
              objectType: params.row.objectType as DomainObjectType,
              objectId: String(params.row.objectId),
            }}
          >
            <Button size="small" color="inherit">
              Fachobjekt
            </Button>
          </Link>
        </Stack>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Card
        sx={{
          background: 'linear-gradient(135deg, #22325f, #375cab)',
          color: '#fff',
          borderRadius: 4,
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight={700}>
            Arbeitskorb
          </Typography>
          <Typography sx={{ opacity: 0.85 }}>
            Korb-Switching ist getrennt von der globalen Bestandssuche.
          </Typography>
        </CardContent>
      </Card>
      <Card
        sx={{
          borderRadius: 4,
          transition: 'transform 180ms ease',
          '&:hover': { transform: 'translateY(-2px)' },
        }}
      >
        <CardContent>
          <Tabs value={basket} onChange={(_, value) => setBasket(value)}>
            {basketTabs.map((tab) => (
              <Tab
                key={tab.value}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Tabs>
          <Box
            component="form"
            onSubmit={basketForm.handleSubmit((values) => {
              setBasketPaginationModel((prev) => ({ ...prev, page: 0 }));
              setBasketFilters(values);
            })}
            mt={2}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ md: 'center' }}
            >
              <Controller
                name="status"
                control={basketForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    sx={{ minWidth: 220 }}
                  >
                    <MenuItem value="">Alle</MenuItem>
                    <MenuItem value="OPEN">OPEN</MenuItem>
                    <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                    <MenuItem value="BLOCKED">BLOCKED</MenuItem>
                    <MenuItem value="DONE">DONE</MenuItem>
                  </TextField>
                )}
              />
              {basket === BasketScope.COLLEAGUE && (
                <Controller
                  name="colleague"
                  control={basketForm.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Kollege"
                      placeholder="z. B. Bob"
                      sx={{ minWidth: 240 }}
                    />
                  )}
                />
              )}
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
              >
                Korb laden
              </Button>
            </Stack>
          </Box>
          {basketFilters.colleague === '' &&
            basket === BasketScope.COLLEAGUE && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Bitte Name eines Kollegen eintragen.
              </Alert>
            )}
          {basketQuery.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Fehler beim Laden des Arbeitskorbs.
            </Alert>
          )}
          <Box mt={2}>
            <DataGrid
              autoHeight
              rows={basketQuery.data?.items ?? []}
              columns={columns}
              loading={basketQuery.isLoading}
              paginationMode="server"
              rowCount={basketQuery.data?.total ?? 0}
              paginationModel={basketPaginationModel}
              onPaginationModelChange={setBasketPaginationModel}
              pageSizeOptions={[
                appEnv.defaultPageSize,
                appEnv.defaultPageSize * 2,
                appEnv.defaultPageSize * 4,
              ]}
              disableRowSelectionOnClick
            />
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ borderRadius: 4, background: '#0f172a', color: '#fff' }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <PublicIcon />
            <Typography variant="h6" fontWeight={700}>
              Globale Bestandssuche
            </Typography>
          </Stack>
          <Box
            component="form"
            onSubmit={globalForm.handleSubmit((values) => {
              setGlobalPaginationModel((prev) => ({ ...prev, page: 0 }));
              setGlobalFilters(values);
            })}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Controller
                name="q"
                control={globalForm.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Suche über alle Aufgaben"
                    fullWidth
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: '#fff',
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="status"
                control={globalForm.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    sx={{ minWidth: 220, bgcolor: '#fff', borderRadius: 2 }}
                  >
                    <MenuItem value="">Alle</MenuItem>
                    <MenuItem value="OPEN">OPEN</MenuItem>
                    <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                    <MenuItem value="BLOCKED">BLOCKED</MenuItem>
                    <MenuItem value="DONE">DONE</MenuItem>
                  </TextField>
                )}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                startIcon={<SearchIcon />}
              >
                Global suchen
              </Button>
            </Stack>
          </Box>
          {globalSearchQuery.isError && globalFilters && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Fehler bei der globalen Suche.
            </Alert>
          )}
          {globalFilters && (
            <Box mt={2}>
              <DataGrid
                autoHeight
                rows={globalSearchQuery.data?.items ?? []}
                columns={columns}
                loading={globalSearchQuery.isLoading}
                paginationMode="server"
                rowCount={globalSearchQuery.data?.total ?? 0}
                paginationModel={globalPaginationModel}
                onPaginationModelChange={setGlobalPaginationModel}
                pageSizeOptions={[
                  appEnv.defaultPageSize,
                  appEnv.defaultPageSize * 2,
                ]}
                disableRowSelectionOnClick
                sx={{ bgcolor: '#fff', borderRadius: 2 }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
