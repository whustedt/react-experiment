import { useQuery } from '@tanstack/react-query';
import { getWorkItemById } from '../../../api/workItems';

export const workItemDetailQueryKeys = {
  all: ['workItems'] as const,
  detail: (id: string) => [...workItemDetailQueryKeys.all, 'detail', id] as const,
};

export function useWorkItemDetailQuery(id: string) {
  return useQuery({
    queryKey: workItemDetailQueryKeys.detail(id),
    queryFn: () => getWorkItemById(id),
  });
}
