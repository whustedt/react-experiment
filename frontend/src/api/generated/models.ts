export enum WorkItemStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED',
  DONE = 'DONE',
}

export enum BasketScope {
  MY = 'MY',
  TEAM = 'TEAM',
  COLLEAGUE = 'COLLEAGUE',
}

export enum DomainObjectType {
  CUSTOMER = 'CUSTOMER',
  CONTRACT = 'CONTRACT',
  CLAIM = 'CLAIM',
}

export interface WorkItemDto {
  id?: string;
  objectType?: DomainObjectType;
  objectId?: string;
  objectLabel?: string;
  customerName?: string;
  contractNo?: string;
  claimNo?: string;
  title?: string;
  description?: string;
  status?: WorkItemStatus;
  priority?: number;
  receivedAt?: string;
  dueAt?: string;
  assignedTo?: string;
  team?: string;
}

export interface WorkItemsPageDto {
  items?: WorkItemDto[];
  total?: number;
}

export interface DocumentDto {
  id?: string;
  fileName?: string;
  mimeType?: string;
  sizeInBytes?: number;
  indexKeywords?: string[];
  uploadedAt?: string;
  uploadedBy?: string;
}

export interface ProtocolEntryDto {
  id?: string;
  timestamp?: string;
  source?: string;
  message?: string;
}

export interface ContextViewDto {
  objectType?: DomainObjectType;
  objectId?: string;
  title?: string;
  subtitle?: string;
  tasks?: WorkItemDto[];
  documents?: DocumentDto[];
  protocolEntries?: ProtocolEntryDto[];
}

export interface UploadDocumentCommand {
  fileName?: string;
  mimeType?: string;
  sizeInBytes?: number;
  indexKeywords?: string[];
  uploadedBy?: string;
}

export enum WorkItemActionType {
  START = 'START',
  FORWARD = 'FORWARD',
  RESCHEDULE = 'RESCHEDULE',
  COMPLETE = 'COMPLETE',
}

export interface WorkItemActionCommand {
  action?: WorkItemActionType;
  comment?: string;
  assignee?: string;
  followUpAt?: string;
}
