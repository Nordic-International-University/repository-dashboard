import { useQuery, useMutation } from 'react-query'
import { toast } from 'sonner'
import type { CollectionFormValues } from '@/../types/colecctions/collections.types'
import { collectionsService } from '@/services/collections.service'

export const useCollectionsQuery = (pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ['collections', pageNumber, pageSize],
    queryFn: () => collectionsService.getCollections({ pageNumber, pageSize }),
  })
}

export const useCreateCollectionMutation = (refetchCallback: () => void) => {
  return useMutation({
    mutationFn: (payload: CollectionFormValues) => collectionsService.createCollection(payload),
    onSuccess: () => {
      toast.success(`Bo'lim muvaffaqiyatli yaratildi!`)
      refetchCallback()
    },
    onError: () => {
      toast.error(`Bo'lim yaratishda xatolik yuz berdi!`)
    },
  })
}

export const useDeleteCollectionMutation = (refetchCallback: () => void) => {
  return useMutation({
    mutationFn: (id: string) => collectionsService.deleteCollection(id),
    onSuccess: () => {
      toast.success(`Bo'lim muvaffaqiyatli O'chirildi!`)
      refetchCallback()
    },
    onError: () => {
      toast.error(`Bo'lim O'chirishda xatolik yuz berdi!`)
    },
  })
}

export const useUpdateCollectionMutation = (refetchCallback: () => void) => {
  return useMutation({
    mutationFn: ({ payload, id }: { payload: CollectionFormValues; id: string }) =>
      collectionsService.updateCollection(id, payload),
    onSuccess: () => {
      toast.success(`Bo'lim muvaffaqiyatli Tahrirlandi!`)
      refetchCallback()
    },
    onError: () => {
      toast.error(`Bo'lim yaratishda xatolik yuz berdi!`)
    },
  })
}
