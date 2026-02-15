import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getContextView, uploadDocument, type DomainObjectType, type UploadDocumentCommand } from '../../../api/workItems';

export const contextQueryKey = (objectType: DomainObjectType, objectId: string) => ['context', objectType, objectId] as const;

export function useContextQuery(objectType?: DomainObjectType, objectId?: string) {
  return useQuery({
    queryKey: ['context', objectType, objectId],
    queryFn: () => getContextView(objectType!, objectId!),
    enabled: Boolean(objectType && objectId),
  });
}

export function useUploadDocumentMutation(objectType?: DomainObjectType, objectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (command: UploadDocumentCommand) => uploadDocument(objectType!, objectId!, command),
    onSuccess: () => {
      if (objectType && objectId) {
        queryClient.invalidateQueries({ queryKey: contextQueryKey(objectType, objectId) });
      }
    },
  });
}
