import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import { Alert, Box, Button, Card, CardContent, Chip, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Link } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { BasketScope, DomainObjectType, WorkItemStatus } from '../../../api/workItems';
import { useWorklistQuery } from '../api/queries';

const filterSchema = z.object({
  q: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE']).or(z.literal('')).default(''),
  basket: z.enum(['MY', 'TEAM', 'COLLEAGUE']).default('MY'),
  colleague: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const statusColorMap: Record<WorkItemStatus, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  OPEN: 'warning',
  IN_PROGRESS: 'info',
  BLOCKED: 'error',
  DONE: 'success',
};

export function WorklistPage() {
  const { control, handleSubmit, watch } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { q: '', status: '', basket: 'MY', colleague: '' },
  });

  const [filters, setFilters] = React.useState<FilterFormValues>({ q: '', status: '', basket: 'MY', colleague: '' });
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({ page: 0, pageSize: 6 });

  const query = useWorklistQuery({
    page: paginationModel.page,
    size: paginationModel.pageSize,
    q: filters.q || undefined,
    status: (filters.status || undefined) as WorkItemStatus | undefined,
    basket: filters.basket as BasketScope,
    colleague: filters.basket === 'COLLEAGUE' ? filters.colleague : undefined,
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.8 },
    { field: 'title', headerName: 'Aufgabe', flex: 1.4 },
    { field: 'customerName', headerName: 'Kunde', flex: 1.2 },
    { field: 'objectLabel', headerName: 'Fachobjekt', flex: 1.2 },
    {
      field: 'objectType',
      headerName: 'Typ',
      flex: 0.8,
      valueFormatter: (value: DomainObjectType) =>
        value === 'CUSTOMER' ? 'Kunde' : value === 'CONTRACT' ? 'Vertrag' : 'Schaden',
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.9,
      renderCell: (params) => <Chip label={params.value} color={statusColorMap[params.value as WorkItemStatus]} size="small" />,
    },
    { field: 'assignedTo', headerName: 'Bearbeiter', flex: 0.9 },
    {
      field: 'open',
      headerName: 'Aktion',
      sortable: false,
      flex: 0.8,
      renderCell: (params) => (
        <Button component={Link} to="/work-items/$id" params={{ id: params.row.id }} startIcon={<OpenInNewIcon />}>
          Öffnen
        </Button>
      ),
    },
  ];

  const onSubmit = (values: FilterFormValues) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setFilters(values);
  };

  const selectedBasket = watch('basket');

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Aufgabenarbeitskorb
      </Typography>
      <Typography color="text.secondary">Mein Korb, Teamkorb, Kollegenkorb und globale Suchmöglichkeiten in einer Oberfläche.</Typography>
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
              <Controller
                name="q"
                control={control}
                render={({ field }) => <TextField {...field} label="Globale Suche" fullWidth placeholder="Kunde, Vertrag, Schaden, Text..." />}
              />
              <Controller
                name="basket"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Korb" sx={{ minWidth: 180 }}>
                    <MenuItem value="MY">Mein Korb</MenuItem>
                    <MenuItem value="TEAM">Teamkorb</MenuItem>
                    <MenuItem value="COLLEAGUE">Kollegenkorb</MenuItem>
                  </TextField>
                )}
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
              {selectedBasket === 'COLLEAGUE' && (
                <Controller
                  name="colleague"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Kollege" sx={{ minWidth: 180 }} placeholder="z.B. Bob" />}
                />
              )}
              <Button type="submit" variant="contained" startIcon={<SearchIcon />}>
                Suchen
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {filters.basket === 'COLLEAGUE' && !filters.colleague && <Alert severity="info">Bitte einen Namen setzen, um den Kollegenkorb zu laden.</Alert>}

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
  );
}
