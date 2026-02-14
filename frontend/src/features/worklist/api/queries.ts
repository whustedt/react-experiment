import { useQuery } from '@tanstack/react-query';
import { searchWorkItems, type WorkItemsSearchParams } from '../../../api/workItems';

export const worklistQueryKeys = {
  all: ['workItems'] as const,
  list: (params: WorkItemsSearchParams) => [...worklistQueryKeys.all, 'list', params] as const,
};

export function useWorkItemsQuery(params: WorkItemsSearchParams) {
  return useQuery({
    queryKey: worklistQueryKeys.list(params),
    queryFn: () => searchWorkItems(params),
    placeholderData: (prev) => prev,
  });
}
