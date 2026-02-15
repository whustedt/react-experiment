import {
  BasketScope,
  DomainObjectType,
  WorkItemsApi,
  WorkItemStatus,
  type ContextViewDto,
  type DocumentDto,
  type UploadDocumentCommand,
  type WorkItemDto,
  type WorkItemsPageDto,
} from './generated';
import { apiConfig } from './client';

const api = new WorkItemsApi(apiConfig);

export interface SearchWorkItemsParams {
  page: number;
  size: number;
  sort?: string;
  q?: string;
  status?: WorkItemStatus;
  basket?: BasketScope;
  colleague?: string;
  objectType?: DomainObjectType;
  objectId?: string;
}

function normalizeWorkItem(item: WorkItemDto): Required<WorkItemDto> {
  return {
    id: item.id ?? '',
    objectType: item.objectType ?? DomainObjectType.CUSTOMER,
    objectId: item.objectId ?? '',
    objectLabel: item.objectLabel ?? '',
    customerName: item.customerName ?? '',
    contractNo: item.contractNo ?? '',
    claimNo: item.claimNo ?? '',
    title: item.title ?? '',
    description: item.description ?? '',
    status: item.status ?? WorkItemStatus.OPEN,
    priority: item.priority ?? 0,
    receivedAt: item.receivedAt ?? '',
    dueAt: item.dueAt ?? '',
    assignedTo: item.assignedTo ?? '',
    team: item.team ?? '',
  };
}

function normalizeDocument(doc: DocumentDto): Required<DocumentDto> {
  return {
    id: doc.id ?? '',
    fileName: doc.fileName ?? '',
    mimeType: doc.mimeType ?? '',
    sizeInBytes: doc.sizeInBytes ?? 0,
    indexKeywords: doc.indexKeywords ?? [],
    uploadedAt: doc.uploadedAt ?? '',
    uploadedBy: doc.uploadedBy ?? '',
  };
}

function normalizePage(page: WorkItemsPageDto): { items: Required<WorkItemDto>[]; total: number } {
  return {
    items: (page.items ?? []).map(normalizeWorkItem),
    total: page.total ?? 0,
  };
}

function normalizeContext(ctx: ContextViewDto): Required<ContextViewDto> {
  return {
    objectType: ctx.objectType ?? DomainObjectType.CUSTOMER,
    objectId: ctx.objectId ?? '',
    title: ctx.title ?? '',
    subtitle: ctx.subtitle ?? '',
    tasks: (ctx.tasks ?? []).map(normalizeWorkItem),
    documents: (ctx.documents ?? []).map(normalizeDocument),
    protocolEntries: (ctx.protocolEntries ?? []).map((entry) => ({
      id: entry.id ?? '',
      timestamp: entry.timestamp ?? '',
      source: entry.source ?? '',
      message: entry.message ?? '',
    })),
  };
}

export async function searchWorkItems(params: SearchWorkItemsParams) {
  const result = await api.searchWorkItems(params);
  return normalizePage(result);
}

export async function getWorkItemById(id: string) {
  const result = await api.getWorkItemById({ id });
  return normalizeWorkItem(result);
}

export async function getContextView(objectType: DomainObjectType, objectId: string) {
  const result = await api.getContextView({ objectType, objectId });
  return normalizeContext(result);
}

export async function uploadDocument(objectType: DomainObjectType, objectId: string, command: UploadDocumentCommand) {
  const result = await api.uploadDocument({ objectType, objectId, command });
  return normalizeDocument(result);
}

export { BasketScope, DomainObjectType, WorkItemStatus };

export type { UploadDocumentCommand };
