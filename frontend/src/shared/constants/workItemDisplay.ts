import type { ChipProps } from '@mui/material';
import { DomainObjectType, WorkItemActionType, WorkItemStatus } from '../../api/workItems';

export const WORK_ITEM_STATUS_OPTIONS: WorkItemStatus[] = [
  WorkItemStatus.OPEN,
  WorkItemStatus.IN_PROGRESS,
  WorkItemStatus.BLOCKED,
  WorkItemStatus.DONE,
];

export const WORK_ITEM_STATUS_COLOR_MAP: Record<WorkItemStatus, ChipProps['color']> = {
  [WorkItemStatus.OPEN]: 'warning',
  [WorkItemStatus.IN_PROGRESS]: 'info',
  [WorkItemStatus.BLOCKED]: 'error',
  [WorkItemStatus.DONE]: 'success',
};

export const DOMAIN_OBJECT_LABEL_MAP: Record<DomainObjectType, string> = {
  [DomainObjectType.CUSTOMER]: 'Kunde',
  [DomainObjectType.CONTRACT]: 'Vertrag',
  [DomainObjectType.CLAIM]: 'Schaden',
};

export const WORK_ITEM_ACTION_LABEL_MAP: Record<WorkItemActionType, string> = {
  [WorkItemActionType.START]: 'Starten',
  [WorkItemActionType.FORWARD]: 'Weiterleiten',
  [WorkItemActionType.RESCHEDULE]: 'Wiedervorlage',
  [WorkItemActionType.COMPLETE]: 'Abschließen',
};
