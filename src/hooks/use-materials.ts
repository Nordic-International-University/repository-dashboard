import { useMutation, useQuery } from 'react-query'
import { toast } from 'sonner'
import { ResourceFormValues } from '../../types/material/material.types'
import { resourceService } from '@/services/materials.service'

export const useResourcesQuery = (
  pageNumber: number,
  pageSize: number,
  search = '',
  filters?: any
) =>
  useQuery(['resources', pageNumber, pageSize, search, filters], () =>
    resourceService.getResources(pageNumber, pageSize, search, filters)
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
            onError: (error:any) => {
              if (error?.name === 'PermissionError' || error?.response?.data?.message === 'Insufficient permissions') {
        toast.error('Bu amal uchun sizda ruxsat yo\'q')
              } else {
        toast.error(error?.message || error?.response?.data?.message || 'nomalum xatolik')
              }
            },
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
      onError: (error:any) => {
        if (error?.name === 'PermissionError' || error?.response?.data?.message === 'Insufficient permissions') {
          toast.error('Bu amal uchun sizda ruxsat yo\'q')
        } else {
          toast.error(error?.message || error?.response?.data?.message || 'nomalum xatolik')
        }
      },
    }
  )

export const useDeleteResourceMutation = (onSuccess?: () => void) =>
  // @ts-ignore
  useMutation((id: string) => resourceService.deleteResource(id), {
    onSuccess: () => {
      toast.success('Resurs o‘chirildi')
      onSuccess?.()
    },
          onError: (error:any) => {
      if (error?.name === 'PermissionError' || error?.response?.data?.message === 'Insufficient permissions') {
        toast.error('Bu amal uchun sizda ruxsat yo\'q')
      } else {
        toast.error(error?.message || error?.response?.data?.message || 'nomalum xatolik')
      }
          },
  })
