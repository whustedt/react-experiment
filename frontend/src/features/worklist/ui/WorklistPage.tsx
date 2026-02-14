import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Link } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { WorkItemStatus } from '../../../api/generated';
import { useWorklistQuery } from '../api/queries';

const filterSchema = z.object({
  q: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE']).or(z.literal('')).default(''),
});

type FilterFormValues = z.infer<typeof filterSchema>;

export function WorklistPage() {
  const { control, handleSubmit } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { q: '', status: '' },
  });

  const [filters, setFilters] = React.useState({ q: '', status: '' as FilterFormValues['status'] });
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({ page: 0, pageSize: 5 });

  const query = useWorklistQuery({
    page: paginationModel.page,
    size: paginationModel.pageSize,
    q: filters.q || undefined,
    status: (filters.status || undefined) as WorkItemStatus | undefined,
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'customerName', headerName: 'Kunde', flex: 1.5 },
    { field: 'type', headerName: 'Typ', flex: 1.2 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'assignedTo', headerName: 'Zuständig', flex: 1 },
    {
      field: 'open',
      headerName: 'Aktion',
      sortable: false,
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

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Worklist</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller
            name="q"
            control={control}
            render={({ field }) => <TextField {...field} label="Suche" fullWidth />}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Status" sx={{ minWidth: 220 }}>
                <MenuItem value="">Alle</MenuItem>
                <MenuItem value="OPEN">OPEN</MenuItem>
                <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                <MenuItem value="DONE">DONE</MenuItem>
              </TextField>
            )}
          />
          <Button type="submit" variant="contained">
            Filtern
          </Button>
        </Stack>
      </Box>
      <DataGrid
        autoHeight
        rows={query.data?.items ?? []}
        columns={columns}
        loading={query.isLoading}
        paginationMode="server"
        rowCount={query.data?.total ?? 0}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
      />
    </Stack>
  );
}
