import { DomainObjectType, WorkItemStatus } from '../../api/workItems';

export const domainObjectTypeLabelMap: Record<DomainObjectType, string> = {
  CUSTOMER: 'Kunde',
  CONTRACT: 'Vertrag',
  CLAIM: 'Schaden',
};

export const workItemStatusColorMap: Record<
  WorkItemStatus,
  'default' | 'warning' | 'info' | 'success' | 'error'
> = {
  OPEN: 'warning',
  IN_PROGRESS: 'info',
  BLOCKED: 'error',
  DONE: 'success',
};
