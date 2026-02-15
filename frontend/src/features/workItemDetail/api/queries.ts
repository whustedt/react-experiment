import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWorkItemById, performWorkItemAction, type WorkItemActionCommand } from '../../../api/workItems';

export const workItemDetailQueryKey = (id: string) => ['work-item', id] as const;

export function useWorkItemDetailQuery(id: string) {
  return useQuery({
    queryKey: workItemDetailQueryKey(id),
    queryFn: () => getWorkItemById(id),
    enabled: Boolean(id),
  });
}

export function useWorkItemActionMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (command: WorkItemActionCommand) => performWorkItemAction(id, command),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(workItemDetailQueryKey(id), updatedItem);
      queryClient.invalidateQueries({ queryKey: ['context', updatedItem.objectType, updatedItem.objectId] });
      queryClient.setQueriesData({ queryKey: ['work-items'] }, (existing: { items: Array<{ id: string }>; total: number } | undefined) => {
        if (!existing) return existing;
        return {
          ...existing,
          items: existing.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
        };
      });
      queryClient.setQueriesData(
        { queryKey: ['work-items-global'] },
        (existing: { items: Array<{ id: string }>; total: number } | undefined) => {
          if (!existing) return existing;
          return {
            ...existing,
            items: existing.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
          };
        },
      );
    },
  });
}
