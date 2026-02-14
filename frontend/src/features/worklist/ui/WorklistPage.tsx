import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWorkItemsQuery } from '../api/queries';
import type { WorkItemDto, WorkItemStatus } from '../../../api/generated';

const filterSchema = z.object({
  q: z.string().max(120).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE', '']).default(''),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const statusOptions: Array<{ label: string; value: WorkItemStatus | '' }> = [
  { label: 'Alle', value: '' },
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' },
];

export default function WorklistPage() {
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 5 });
  const [filters, setFilters] = useState<FilterFormValues>({ q: '', status: '' });

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: filters,
  });

  const { data, isLoading, isFetching, isError } = useWorkItemsQuery({
    page: pagination.page,
    size: pagination.pageSize,
    sort: 'receivedAt,desc',
    q: filters.q || undefined,
    status: (filters.status || undefined) as WorkItemStatus | undefined,
  });

  const columns = useMemo<GridColDef<WorkItemDto>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 120 },
      { field: 'customerName', headerName: 'Kunde', flex: 1.2, minWidth: 170 },
      { field: 'contractNo', headerName: 'Contract', minWidth: 140 },
      { field: 'type', headerName: 'Typ', minWidth: 150 },
      { field: 'status', headerName: 'Status', minWidth: 150 },
      { field: 'priority', headerName: 'Priorität', minWidth: 130 },
      { field: 'receivedAt', headerName: 'Eingang', minWidth: 180 },
      {
        field: 'actions',
        headerName: 'Aktion',
        sortable: false,
        filterable: false,
        minWidth: 120,
        renderCell: (params) => <Link to="/work-items/$id" params={{ id: params.row.id }}>Öffnen</Link>,
      },
    ],
    [],
  );

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Work Items</Typography>

      <Paper sx={{ p: 2 }}>
        <Box
          component="form"
          onSubmit={form.handleSubmit((values) => {
            setFilters(values);
            setPagination((prev) => ({ ...prev, page: 0 }));
          })}
          sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <TextField label="Suche" size="small" {...form.register('q')} />
          <TextField select label="Status" size="small" defaultValue="" {...form.register('status')}>
            {statusOptions.map((option) => (
              <MenuItem key={option.value || 'all'} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained">
            Anwenden
          </Button>
        </Box>
      </Paper>

      {isError ? <Alert severity="error">Work Items konnten nicht geladen werden.</Alert> : null}

      <Paper>
        <DataGrid
          autoHeight
          loading={isLoading || isFetching}
          rows={data?.items ?? []}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          rowCount={data?.total ?? 0}
          paginationMode="server"
          paginationModel={pagination}
          onPaginationModelChange={setPagination}
          disableRowSelectionOnClick
        />
      </Paper>
    </Stack>
  );
}
