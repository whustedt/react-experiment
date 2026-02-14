import {
  WorkItemsApi,
  type WorkItemDto,
  type WorkItemsPageDto,
  type WorkItemStatus,
} from './generated';
import { apiConfiguration } from './client';

const api = new WorkItemsApi(apiConfiguration);

export type WorkItemsSearchParams = {
  page: number;
  size: number;
  sort?: string;
  q?: string;
  status?: WorkItemStatus;
};

export type NormalizedWorkItemsPage = {
  items: WorkItemDto[];
  total: number;
};

export async function searchWorkItems(params: WorkItemsSearchParams): Promise<NormalizedWorkItemsPage> {
  const result: WorkItemsPageDto = await api.searchWorkItems(params);
  return {
    items: result.items ?? [],
    total: result.total ?? 0,
  };
}

export async function getWorkItemById(id: string): Promise<WorkItemDto> {
  return api.getWorkItemById({ id });
}
