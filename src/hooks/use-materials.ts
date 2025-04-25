import { useMutation, useQuery } from 'react-query'
import { toast } from 'sonner'
import { ResourceFormValues } from '../../types/material/material.types'
import { resourceService } from '@/services/materials.service'

export const useResourcesQuery = (pageNumber: number, pageSize: number, search = '') =>
  useQuery(['resources', pageNumber, pageSize, search], () =>
    resourceService.getResources(pageNumber, pageSize, search)
  )

export const useCreateResourceMutation = (onSuccess?: () => void) =>
  // @ts-ignore
  useMutation((data: ResourceFormValues) => resourceService.createResource(data), {
    onSuccess: () => {
      toast.success('Resurs qo‘shildi', {
        position: 'top-right',
      })
      onSuccess?.()
    },
    onError: () => toast.error('Qo‘shishda xatolik'),
  })

export const useUpdateResourceMutation = (onSuccess?: () => void) =>
  // @ts-ignore
  useMutation(
    ({ id, payload }: { id: string; payload: ResourceFormValues }) =>
      resourceService.updateResource(id, payload),
    {
      onSuccess: () => {
        toast.success('Resurs yangilandi')
        onSuccess?.()
      },
      onError: () => toast.error('Yangilashda xatolik'),
    }
  )

export const useDeleteResourceMutation = (onSuccess?: () => void) =>
  // @ts-ignore
  useMutation((id: string) => resourceService.deleteResource(id), {
    onSuccess: () => {
      toast.success('Resurs o‘chirildi')
      onSuccess?.()
    },
    onError: () => toast.error('O‘chirishda xatolik'),
  })
