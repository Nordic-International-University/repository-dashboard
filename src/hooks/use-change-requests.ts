import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import {
  ChangeRequestFormValues,
  ChangeRequestStatus,
  ChangeRequestQueryParams
} from '@/../types/change-request/change-request.types'
import { changeRequestService } from '@/services/change-request.service'


export const useChangeRequestsQuery = (params: ChangeRequestQueryParams) => {
  return useQuery({
    queryKey: ['changeRequests', params],
    queryFn: () => changeRequestService.getChangeRequests(params),
    onError: (error: AxiosError<any>) => {
      const errorMessage = error?.response?.data.message || 'O\'zgartirish so\'rovlari yuklashda xatolik.'
      toast.error(errorMessage)
    },
  })
}

export const useChangeRequestQuery = (id: string) => {
  return useQuery({
    queryKey: ['changeRequest', id],
    queryFn: () => changeRequestService.getChangeRequest(id),
    enabled: !!id,
    onError: (error: AxiosError<any>) => {
      const errorMessage = error?.response?.data.message || 'So\'rovni yuklashda xatolik.'
      toast.error(errorMessage)
    },
  })
}


export const useCreateChangeRequestMutation = (refetchCallback?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ChangeRequestFormValues) => {
      try {
        const response = await changeRequestService.createChangeRequest(payload)
        return response.data
      } catch (error) {
        const errMessage = (error as AxiosError<any>)?.response?.data.message || 'So\'rov yaratishda xatolik yuz berdi.'
        throw new Error(errMessage)
      }
    },
    onSuccess: () => {
      toast.success(`O'zgartirish so'rovi muvaffaqiyatli yaratildi!`)
      queryClient.invalidateQueries('changeRequests') // Refresh cached queries
      if (refetchCallback) refetchCallback()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateChangeRequestMutation = (refetchCallback?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<ChangeRequestFormValues> }) => {
      try {
        const response = await changeRequestService.updateChangeRequest(id, payload)
        return response.data
      } catch (error) {
        const errMessage = (error as AxiosError<any>)?.response?.data.message || 'So\'rovni yangilashda xatolik yuz berdi.'
        throw new Error(errMessage)
      }
    },
    onSuccess: (_, variables) => {
      const statusText =
          variables.payload.status === ChangeRequestStatus.APPROVED
              ? 'tasdiqlandi'
              : variables.payload.status === ChangeRequestStatus.REJECTED
                  ? 'rad etildi'
                  : "o'zgartirildi"

      toast.success(`O'zgartirish so'rovi muvaffaqiyatli ${statusText}!`)
      queryClient.invalidateQueries('changeRequests') // Refresh cached queries
      if (refetchCallback) refetchCallback()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteChangeRequestMutation = (refetchCallback?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await changeRequestService.deleteChangeRequest(id)
        return response.data
      } catch (error) {
        const errMessage = (error as AxiosError<any>)?.response?.data.message || 'So\'rovni o\'chirishda xatolik yuz berdi.'
        throw new Error(errMessage)
      }
    },
    onSuccess: () => {
      toast.success(`O'zgaritish so'rovi muvaffaqiyatli o'chirildi!`)
      queryClient.invalidateQueries('changeRequests')
      if (refetchCallback) refetchCallback()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}