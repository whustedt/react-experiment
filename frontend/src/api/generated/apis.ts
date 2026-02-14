import type { WorkItemDto, WorkItemsPageDto, WorkItemStatus } from './models';

export interface SearchWorkItemsRequest {
  page?: number;
  size?: number;
  sort?: string;
  q?: string;
  status?: WorkItemStatus;
}

export class Configuration {
  constructor(public basePath: string = '/api') {}
}

export class WorkItemsApi {
  constructor(private config: Configuration = new Configuration()) {}

  async searchWorkItems(params: SearchWorkItemsRequest): Promise<WorkItemsPageDto> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.size !== undefined) query.set('size', String(params.size));
    if (params.sort) query.set('sort', params.sort);
    if (params.q) query.set('q', params.q);
    if (params.status) query.set('status', params.status);

    const response = await fetch(`${this.config.basePath}/work-items?${query.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch work items');
    return response.json() as Promise<WorkItemsPageDto>;
  }

  async getWorkItemById({ id }: { id: string }): Promise<WorkItemDto> {
    const response = await fetch(`${this.config.basePath}/work-items/${id}`);
    if (!response.ok) throw new Error('Failed to fetch work item');
    return response.json() as Promise<WorkItemDto>;
  }
}
