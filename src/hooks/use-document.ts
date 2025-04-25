import { useQuery, useMutation, useQueryClient } from 'react-query'
import { documentService } from '@/services/document.service'
import { toast } from 'sonner'

interface ExtraOptions {
  refetch?: () => void
}

export const useDocumentsQuery = (pageNumber: number, pageSize: number) =>
  useQuery(['documents', pageNumber, pageSize], () =>
    documentService.getDocuments(pageNumber, pageSize)
  )

export const useDeleteDocumentMutation = (
  onSuccess?: () => void,
  pageNumber: number = 1,
  pageSize: number = 100
) => {
  const queryClient = useQueryClient()

  return useMutation({
    // @ts-ignore
    mutationFn: (id: string) => documentService.deleteDocument(id),
    onSuccess: () => {
      toast.success('Fayl o‘chirildi')
      queryClient.invalidateQueries(['documents', pageNumber, pageSize])
      onSuccess?.()
    },
    onError: () => toast.error('Faylni o‘chirishda xatolik'),
  })
}

export const useUploadDocumentMutation = (onSuccess?: () => void) =>
  useMutation({
    // @ts-ignore
    mutationFn: (file: File) => documentService.uploadDocument(file),
    onSuccess: () => {
      toast.success('Fayl yuklandi')
      onSuccess?.()
    },
    onError: () => toast.error('Faylni yuklashda xatolik'),
  })
