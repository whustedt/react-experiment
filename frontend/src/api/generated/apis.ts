import type {
  BasketScope,
  ContextViewDto,
  DocumentDto,
  DomainObjectType,
  UploadDocumentCommand,
  WorkItemDto,
  WorkItemsPageDto,
  WorkItemStatus,
} from './models';

export interface SearchWorkItemsRequest {
  page?: number;
  size?: number;
  sort?: string;
  q?: string;
  status?: WorkItemStatus;
  basket?: BasketScope;
  colleague?: string;
  objectType?: DomainObjectType;
  objectId?: string;
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
    if (params.basket) query.set('basket', params.basket);
    if (params.colleague) query.set('colleague', params.colleague);
    if (params.objectType) query.set('objectType', params.objectType);
    if (params.objectId) query.set('objectId', params.objectId);

    const response = await fetch(`${this.config.basePath}/work-items?${query.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch work items');
    return response.json() as Promise<WorkItemsPageDto>;
  }

  async getWorkItemById({ id }: { id: string }): Promise<WorkItemDto> {
    const response = await fetch(`${this.config.basePath}/work-items/${id}`);
    if (!response.ok) throw new Error('Failed to fetch work item');
    return response.json() as Promise<WorkItemDto>;
  }

  async getContextView({ objectType, objectId }: { objectType: DomainObjectType; objectId: string }): Promise<ContextViewDto> {
    const query = new URLSearchParams({ objectType, objectId });
    const response = await fetch(`${this.config.basePath}/work-items/context?${query.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch context view');
    return response.json() as Promise<ContextViewDto>;
  }

  async uploadDocument({
    objectType,
    objectId,
    command,
  }: {
    objectType: DomainObjectType;
    objectId: string;
    command: UploadDocumentCommand;
  }): Promise<DocumentDto> {
    const response = await fetch(`${this.config.basePath}/work-items/context/${objectType}/${objectId}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
    });
    if (!response.ok) throw new Error('Failed to upload document');
    return response.json() as Promise<DocumentDto>;
  }
}
