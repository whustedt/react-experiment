import { useQuery } from '@tanstack/react-query';
import { getWorkItemById } from '../../../api/workItems';

export const workItemDetailQueryKey = (id: string) => ['work-item', id] as const;

export function useWorkItemDetailQuery(id: string) {
  return useQuery({
    queryKey: workItemDetailQueryKey(id),
    queryFn: () => getWorkItemById(id),
    enabled: Boolean(id),
  });
}
