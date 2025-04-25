import { useQuery, useMutation } from 'react-query'
import { keywordService } from '@/services/keyword.service'
import { toast } from 'sonner'
import { KeywordFormValues } from '../../types/keyword/keyword.types'

export const useKeywordsQuery = (pageNumber: number, pageSize: number, search?: string) =>
  useQuery(['keywords', pageNumber, pageSize, search], () =>
    keywordService.getAll(pageNumber, pageSize, search)
  )

export const useCreateKeywordMutation = (onSuccess?: () => void) =>
  // @ts-ignore
  useMutation((data: KeywordFormValues) => keywordService.create(data), {
    onSuccess: (data) => {
      toast.success("Kalit so'z yaratildi")
      onSuccess?.()
    },
    onError: () => toast.error('Yaratishda xatolik'),
  })

export const useUpdateKeywordMutation = (onSuccess?: () => void) =>
  // @ts-ignore
  useMutation(
    ({ id, payload }: { id: string; payload: KeywordFormValues }) =>
      keywordService.update(id, payload),
    {
      onSuccess: () => {
        toast.success("Kalit so'z yangilandi")
        onSuccess?.()
      },
      onError: () => toast.error('Yangilashda xatolik'),
    }
  )

export const useDeleteKeywordMutation = (onSuccess?: () => void) =>
  // @ts-ignore
  useMutation((id: string) => keywordService.delete(id), {
    onSuccess: () => {
      toast.success("Kalit so'z o'chirildi")
      onSuccess?.()
    },
    onError: () => toast.error('O‘chirishda xatolik'),
  })
