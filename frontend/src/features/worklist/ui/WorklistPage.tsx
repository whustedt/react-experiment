import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
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
type BasketScope = 'MINE' | 'TEAM' | 'COLLEAGUE';

const currentUser = 'anita.schmidt';
const colleagues = ['anita.schmidt', 'mehmet.kaya', 'lara.weis'];

export function WorklistPage() {
  const { control, handleSubmit } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { q: '', status: '' },
  });

  const [filters, setFilters] = React.useState({ q: '', status: '' as FilterFormValues['status'] });
  const [basketScope, setBasketScope] = React.useState<BasketScope>('MINE');
  const [selectedColleague, setSelectedColleague] = React.useState(colleagues[0]);
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({ page: 0, pageSize: 5 });

  const query = useWorklistQuery({
    page: paginationModel.page,
    size: paginationModel.pageSize,
    q: filters.q || undefined,
    status: (filters.status || undefined) as WorkItemStatus | undefined,
  });

  const filteredRows = React.useMemo(() => {
    const rows = query.data?.items ?? [];

    if (basketScope === 'TEAM') {
      return rows;
    }

    if (basketScope === 'COLLEAGUE') {
      return rows.filter((row) => row.assignedTo === selectedColleague);
    }

    const mine = rows.filter((row) => row.assignedTo === currentUser);
    return mine.length > 0 ? mine : rows;
  }, [basketScope, query.data?.items, selectedColleague]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'customerName', headerName: 'Kunde', flex: 1.3 },
    { field: 'contractNo', headerName: 'Vertrag', flex: 1 },
    { field: 'type', headerName: 'Fachobjekt', flex: 1.2 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'assignedTo', headerName: 'Zuständig', flex: 1.2 },
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
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
        <Box>
          <Typography variant="h4">Aufgabenmanagement</Typography>
          <Typography color="text.secondary">Arbeitskorb, Bestandssuche und Kontextzugriff für Fachobjekte</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Chip label="Mein Korb" color={basketScope === 'MINE' ? 'primary' : 'default'} onClick={() => setBasketScope('MINE')} />
          <Chip label="Teamkorb" color={basketScope === 'TEAM' ? 'primary' : 'default'} onClick={() => setBasketScope('TEAM')} />
          <Chip
            label="Kollege"
            color={basketScope === 'COLLEAGUE' ? 'primary' : 'default'}
            onClick={() => setBasketScope('COLLEAGUE')}
          />
        </Stack>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
            <Typography variant="h6">Suche über den Aufgabenbestand</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Controller
                name="q"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Suche (Kunde, Vertrag, Schaden, ID)" fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
                )}
              />
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Status" sx={{ minWidth: 200 }}>
                    <MenuItem value="">Alle</MenuItem>
                    <MenuItem value="OPEN">OPEN</MenuItem>
                    <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                    <MenuItem value="DONE">DONE</MenuItem>
                  </TextField>
                )}
              />
              {basketScope === 'COLLEAGUE' && (
                <TextField
                  select
                  label="Teamkollege"
                  value={selectedColleague}
                  sx={{ minWidth: 200 }}
                  onChange={(event) => setSelectedColleague(event.target.value)}
                >
                  {colleagues.map((colleague) => (
                    <MenuItem key={colleague} value={colleague}>
                      {colleague}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              <Button type="submit" variant="contained">
                Filtern
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <DataGrid
        autoHeight
        rows={filteredRows}
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
