import { useMutation, useQuery } from 'react-query'
import { resourceTypeService } from '@/services/resources.service'
import { ResourceTypeFormValues } from '../../types/resources/rosurce.types'
import { toast } from 'sonner'
import { AxiosError } from 'axios'

export const useResourceTypesQuery = (pageNumber: number, pageSize: number) =>
  useQuery({
    queryKey: ['resource-types', pageNumber, pageSize],
    queryFn: () => resourceTypeService.getResourceTypes(pageNumber, pageSize),
  })

export const useCreateResourceTypeMutation = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: (data: ResourceTypeFormValues) => resourceTypeService.createResourceType(data),
    onSuccess: () => {
      toast.success('Resurs turi muvaffaqiyatli qo‘shildi')
      onSuccess?.()
    },
    onError: (error: AxiosError | any) => {
      toast.error(error?.response?.data?.message || 'nomalum xatolik')
    },
  })

export const useUpdateResourceTypeMutation = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ResourceTypeFormValues }) =>
      resourceTypeService.updateResourceType(id, payload),
    onSuccess: () => {
      toast.success('Resurs turi yangilandi')
      onSuccess?.()
    },
    onError: (error: AxiosError | any) => {
      toast.error(error?.response?.data?.message || 'nomalum xatolik')
    },
  })

export const useDeleteResourceTypeMutation = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: (id: string) => resourceTypeService.deleteResourceType(id),
    onSuccess: () => {
      toast.success('Resurs turi o‘chirildi')
      onSuccess?.()
    },
    onError: (error: AxiosError | any) => {
      toast.error(error?.response?.data?.message || 'nomalum xatolik')
    },
  })
