import { useQuery } from '@tanstack/react-query';
import { BasketScope, searchWorkItems, type DomainObjectType, type WorkItemStatus } from '../../../api/workItems';

export interface WorklistFilters {
  page: number;
  size: number;
  q?: string;
  status?: WorkItemStatus;
  basket: BasketScope;
  colleague?: string;
  objectType?: DomainObjectType;
  objectId?: string;
}

export const worklistQueryKey = (filters: WorklistFilters) => ['work-items', filters] as const;

export function useWorklistQuery(filters: WorklistFilters) {
  return useQuery({
    queryKey: worklistQueryKey(filters),
    queryFn: () => searchWorkItems({ ...filters, sort: 'receivedAt,desc' }),
  });
}
