import { useQuery } from '@tanstack/react-query';
import { searchWorkItems } from '../../../api/workItems';
import type { WorkItemStatus } from '../../../api/generated';

export interface WorklistFilters {
  page: number;
  size: number;
  q?: string;
  status?: WorkItemStatus;
}

export const worklistQueryKey = (filters: WorklistFilters) => ['work-items', filters] as const;

export function useWorklistQuery(filters: WorklistFilters) {
  return useQuery({
    queryKey: worklistQueryKey(filters),
    queryFn: () => searchWorkItems({ ...filters, sort: 'receivedAt,desc' }),
  });
}
