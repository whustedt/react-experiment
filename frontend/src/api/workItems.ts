import { WorkItemStatus, WorkItemsApi, type WorkItemDto, type WorkItemsPageDto } from './generated';
import { apiConfig } from './client';

const api = new WorkItemsApi(apiConfig);

export interface SearchWorkItemsParams {
  page: number;
  size: number;
  sort?: string;
  q?: string;
  status?: WorkItemStatus;
}

function normalizeWorkItem(item: WorkItemDto): Required<WorkItemDto> {
  return {
    id: item.id ?? '',
    customerName: item.customerName ?? '',
    contractNo: item.contractNo ?? '',
    type: item.type ?? '',
    status: item.status ?? WorkItemStatus.OPEN,
    priority: item.priority ?? 0,
    receivedAt: item.receivedAt ?? '',
    assignedTo: item.assignedTo ?? '',
  };
}

function normalizePage(page: WorkItemsPageDto): { items: Required<WorkItemDto>[]; total: number } {
  return {
    items: (page.items ?? []).map(normalizeWorkItem),
    total: page.total ?? 0,
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
