import { useQuery, useMutation } from 'react-query'
import { toast } from 'sonner'
import type { CollectionFormValues } from '@/../types/colecctions/collections.types'
import { collectionsService } from '@/services/collections.service'
import { AxiosError } from 'axios'

export const useCollectionsQuery = (pageNumber: number, pageSize: number, search?: string) => {
  return useQuery({
    queryKey: ['collections', pageNumber, pageSize, search],
    queryFn: () => collectionsService.getCollections({ pageNumber, pageSize, search }),
  })
}

export const useCreateCollectionMutation = (refetchCallback: () => void) => {
  return useMutation({
    mutationFn: (payload: CollectionFormValues) => collectionsService.createCollection(payload),
    onSuccess: () => {
      toast.success(`Bo'lim muvaffaqiyatli yaratildi!`)
      refetchCallback()
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error?.response?.data.message || 'nomalum xatolik')
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
    onError: (error: AxiosError<any>) => {
      toast.error(error?.response?.data.message || 'nomalum xatolik')
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
    onError: (error: AxiosError<any>) => {
      toast.error(error?.response?.data.message || 'nomalum xatolik')
    },
  })
}
