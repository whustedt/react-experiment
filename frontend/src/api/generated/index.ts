export type WorkItemStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export interface WorkItemDto {
  id: string;
  customerName: string;
  contractNo: string;
  type: string;
  status: WorkItemStatus;
  priority: string;
  receivedAt: string;
  assignedTo: string;
}

export interface WorkItemsPageDto {
  items?: WorkItemDto[];
  total?: number;
}

export interface SearchWorkItemsRequest {
  page?: number;
  size?: number;
  sort?: string;
  q?: string;
  status?: WorkItemStatus;
}

export interface ConfigurationParameters {
  basePath?: string;
}

export class Configuration {
  basePath: string;

  constructor(parameters: ConfigurationParameters = {}) {
    this.basePath = parameters.basePath ?? '';
  }
}

export class WorkItemsApi {
  constructor(private readonly configuration: Configuration = new Configuration()) {}

  async searchWorkItems(requestParameters: SearchWorkItemsRequest = {}): Promise<WorkItemsPageDto> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(requestParameters)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }

    const response = await fetch(
      `${this.configuration.basePath}/api/work-items${params.toString() ? `?${params.toString()}` : ''}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to search work items: ${response.status}`);
    }
    return (await response.json()) as WorkItemsPageDto;
  }

  async getWorkItemById(requestParameters: { id: string }): Promise<WorkItemDto> {
    const response = await fetch(`${this.configuration.basePath}/api/work-items/${requestParameters.id}`);
    if (!response.ok) {
      throw new Error(`Failed to load work item: ${response.status}`);
    }
    return (await response.json()) as WorkItemDto;
  }
}
