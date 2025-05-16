import { useQuery, useMutation } from 'react-query'
import { toast } from 'sonner'
import type { 
  ChangeRequestFormValues, 
  ChangeRequestStatus, 
  ChangeRequestQueryParams 
} from '@/../types/change-request/change-request.types'
import { changeRequestService } from '@/services/change-request.service'
import { AxiosError } from 'axios'

export const useChangeRequestsQuery = (params: ChangeRequestQueryParams) => {
  return useQuery({
    queryKey: ['changeRequests', params],
    queryFn: () => changeRequestService.getChangeRequests(params),
  })
}

export const useChangeRequestQuery = (id: string) => {
  return useQuery({
    queryKey: ['changeRequest', id],
    queryFn: () => changeRequestService.getChangeRequest(id),
    enabled: !!id,
  })
}

export const useCreateChangeRequestMutation = (refetchCallback: () => void) => {
  return useMutation({
    mutationFn: (payload: ChangeRequestFormValues) => changeRequestService.createChangeRequest(payload),
    onSuccess: () => {
      toast.success(`O'zgartirish so'rovi muvaffaqiyatli yaratildi!`)
      refetchCallback()
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error?.response?.data.message || 'nomalum xatolik')
    },
  })
}

export const useUpdateChangeRequestMutation = (refetchCallback: () => void) => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ChangeRequestFormValues> }) =>
      changeRequestService.updateChangeRequest(id, payload),
    onSuccess: (_, variables) => {
      const statusText = variables.payload.status === ChangeRequestStatus.APPROVED 
        ? 'tasdiqlandi' 
        : variables.payload.status === ChangeRequestStatus.REJECTED 
          ? 'rad etildi' 
          : "o'zgartirildi"
      toast.success(`O'zgartirish so'rovi muvaffaqiyatli ${statusText}!`)
      refetchCallback()
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error?.response?.data.message || 'nomalum xatolik')
    },
  })
}

export const useDeleteChangeRequestMutation = (refetchCallback: () => void) => {
  return useMutation({
    mutationFn: (id: string) => changeRequestService.deleteChangeRequest(id),
    onSuccess: () => {
      toast.success(`O'zgartirish so'rovi muvaffaqiyatli o'chirildi!`)
      refetchCallback()
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error?.response?.data.message || 'nomalum xatolik')
    },
  })
}
