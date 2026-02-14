export enum WorkItemStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface WorkItemDto {
  id?: string;
  customerName?: string;
  contractNo?: string;
  type?: string;
  status?: WorkItemStatus;
  priority?: number;
  receivedAt?: string;
  assignedTo?: string;
}

export interface WorkItemsPageDto {
  items?: WorkItemDto[];
  total?: number;
}
