import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { DataGrid, type GridPaginationModel } from '@mui/x-data-grid';
import { Controller, useForm } from 'react-hook-form';
import { BasketScope, type WorkItemStatus } from '../../../api/workItems';
import { useGlobalWorkItemSearchQuery, useWorklistQuery } from '../api/queries';
import {
  basketFilterDefaultValues,
  basketFilterSchema,
  type BasketFilterFormValues,
  globalSearchDefaultValues,
  globalSearchSchema,
  type GlobalSearchFormValues,
} from '../model/forms';
import { worklistColumns } from './worklistColumns';

const basketTabs: { value: BasketScope; label: string; icon: React.ReactElement }[] = [
  { value: BasketScope.MY, label: 'Meine Aufgaben', icon: <PersonSearchIcon /> },
  { value: BasketScope.TEAM, label: 'Teamkorb', icon: <WorkspacesIcon /> },
  { value: BasketScope.COLLEAGUE, label: 'Kollegenkorb', icon: <PersonSearchIcon /> },
];

function StatusSelectField({ value, onChange, sx }: { value: string; onChange: (value: string) => void; sx?: object }) {
  return (
    <TextField value={value} onChange={(event) => onChange(event.target.value)} select label="Status" sx={sx}>
      <MenuItem value="">Alle</MenuItem>
      <MenuItem value="OPEN">OPEN</MenuItem>
      <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
      <MenuItem value="BLOCKED">BLOCKED</MenuItem>
      <MenuItem value="DONE">DONE</MenuItem>
    </TextField>
  );
}

export function WorklistPage() {
  const [basket, setBasket] = React.useState<BasketScope>(BasketScope.MY);
  const [basketFilters, setBasketFilters] = React.useState<BasketFilterFormValues>(basketFilterDefaultValues);
  const [globalFilters, setGlobalFilters] = React.useState<GlobalSearchFormValues | null>(null);
  const [basketPaginationModel, setBasketPaginationModel] = React.useState<GridPaginationModel>({ page: 0, pageSize: 6 });
  const [globalPaginationModel, setGlobalPaginationModel] = React.useState<GridPaginationModel>({ page: 0, pageSize: 6 });

  const basketForm = useForm<BasketFilterFormValues>({ resolver: zodResolver(basketFilterSchema), defaultValues: basketFilterDefaultValues });
  const globalForm = useForm<GlobalSearchFormValues>({ resolver: zodResolver(globalSearchSchema), defaultValues: globalSearchDefaultValues });

  const basketQuery = useWorklistQuery({
    page: basketPaginationModel.page,
    size: basketPaginationModel.pageSize,
    status: (basketFilters.status || undefined) as WorkItemStatus | undefined,
    basket,
    colleague: basket === BasketScope.COLLEAGUE ? basketFilters.colleague : undefined,
  });

  const globalSearchQuery = useGlobalWorkItemSearchQuery(
    {
      page: globalPaginationModel.page,
      size: globalPaginationModel.pageSize,
      q: globalFilters?.q ?? '',
      status: (globalFilters?.status || undefined) as WorkItemStatus | undefined,
    },
    Boolean(globalFilters?.q),
  );

  const onBasketSubmit = (values: BasketFilterFormValues) => {
    setBasketPaginationModel((prev) => ({ ...prev, page: 0 }));
    setBasketFilters(values);
  };

  const onGlobalSubmit = (values: GlobalSearchFormValues) => {
    setGlobalPaginationModel((prev) => ({ ...prev, page: 0 }));
    setGlobalFilters(values);
  };

  return (
    <Stack spacing={3}>
      <Card sx={{ background: 'linear-gradient(135deg, #22325f, #375cab)', color: '#fff', borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={700}>Arbeitskorb</Typography>
          <Typography sx={{ opacity: 0.85 }}>Korb-Switching ist getrennt von der globalen Bestandssuche.</Typography>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4, transition: 'transform 180ms ease', '&:hover': { transform: 'translateY(-2px)' } }}>
        <CardContent>
          <Tabs value={basket} onChange={(_, value) => setBasket(value)}>
            {basketTabs.map((tab) => <Tab key={tab.value} icon={tab.icon} iconPosition="start" label={tab.label} value={tab.value} />)}
          </Tabs>

          <Box component="form" onSubmit={basketForm.handleSubmit(onBasketSubmit)} mt={2}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
              <Controller
                name="status"
                control={basketForm.control}
                render={({ field }) => <StatusSelectField value={field.value} onChange={field.onChange} sx={{ minWidth: 220 }} />}
              />
              {basket === BasketScope.COLLEAGUE && (
                <Controller
                  name="colleague"
                  control={basketForm.control}
                  render={({ field }) => <TextField {...field} label="Kollege" placeholder="z. B. Bob" sx={{ minWidth: 240 }} />}
                />
              )}
              <Button type="submit" variant="contained" startIcon={<SearchIcon />}>Korb laden</Button>
            </Stack>
          </Box>

          {basketFilters.colleague === '' && basket === BasketScope.COLLEAGUE && (
            <Alert severity="info" sx={{ mt: 2 }}>Bitte Name eines Kollegen eintragen.</Alert>
          )}

          <Box mt={2}>
            <DataGrid
              autoHeight
              rows={basketQuery.data?.items ?? []}
              columns={worklistColumns}
              loading={basketQuery.isLoading}
              paginationMode="server"
              rowCount={basketQuery.data?.total ?? 0}
              paginationModel={basketPaginationModel}
              onPaginationModelChange={setBasketPaginationModel}
              pageSizeOptions={[6, 12, 24]}
              disableRowSelectionOnClick
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4, background: '#0f172a', color: '#fff' }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <PublicIcon />
            <Typography variant="h6" fontWeight={700}>Globale Bestandssuche</Typography>
          </Stack>

          <Box component="form" onSubmit={globalForm.handleSubmit(onGlobalSubmit)}>
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
                    sx={{ '& .MuiInputBase-root': { bgcolor: '#fff', borderRadius: 2 } }}
                  />
                )}
              />
              <Controller
                name="status"
                control={globalForm.control}
                render={({ field }) => (
                  <StatusSelectField
                    value={field.value}
                    onChange={field.onChange}
                    sx={{ minWidth: 220, bgcolor: '#fff', borderRadius: 2 }}
                  />
                )}
              />
              <Button type="submit" variant="contained" color="secondary" startIcon={<SearchIcon />}>Global suchen</Button>
            </Stack>
          </Box>

          {globalFilters && (
            <Box mt={2}>
              <DataGrid
                autoHeight
                rows={globalSearchQuery.data?.items ?? []}
                columns={worklistColumns}
                loading={globalSearchQuery.isLoading}
                paginationMode="server"
                rowCount={globalSearchQuery.data?.total ?? 0}
                paginationModel={globalPaginationModel}
                onPaginationModelChange={setGlobalPaginationModel}
                pageSizeOptions={[6, 12]}
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
