import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button, Chip, Stack } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Link } from '@tanstack/react-router';
import { type DomainObjectType, type WorkItemStatus } from '../../../api/workItems';

const statusColorMap: Record<WorkItemStatus, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  OPEN: 'warning',
  IN_PROGRESS: 'info',
  BLOCKED: 'error',
  DONE: 'success',
};

const objectTypeLabelMap: Record<DomainObjectType, string> = {
  CUSTOMER: 'Kunde',
  CONTRACT: 'Vertrag',
  CLAIM: 'Schaden',
};

export const worklistColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.8 },
  { field: 'title', headerName: 'Aufgabe', flex: 1.4 },
  { field: 'customerName', headerName: 'Kunde', flex: 1.1 },
  { field: 'objectLabel', headerName: 'Fachobjekt', flex: 1.1 },
  {
    field: 'objectType',
    headerName: 'Typ',
    flex: 0.8,
    valueFormatter: (value: DomainObjectType) => objectTypeLabelMap[value] ?? value,
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
    flex: 1.3,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <Link to="/work-items/$id" params={{ id: String(params.row.id) }}>
          <Button size="small" startIcon={<OpenInNewIcon />}>Aufgabe</Button>
        </Link>
        <Link
          to="/objects/$objectType/$objectId"
          params={{ objectType: params.row.objectType as DomainObjectType, objectId: String(params.row.objectId) }}
        >
          <Button size="small" color="inherit">Fachobjekt</Button>
        </Link>
      </Stack>
    ),
  },
];
