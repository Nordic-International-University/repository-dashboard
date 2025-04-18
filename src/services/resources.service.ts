import { axiosInstance } from '@/services/base.axios'
import {
  PaginatedResponse,
  ResourceType,
  ResourceTypeFormValues,
} from '../../types/resources/rosurce.types'

export const resourceTypeService = {
  getResourceTypes: async (
    pageNumber: number,
    pageSize: number,
    search?: string
  ): Promise<PaginatedResponse<ResourceType>> => {
    const { data } = await axiosInstance.get('/resource-type', {
      params: {
        pageNumber,
        pageSize,
        search,
      },
    })
    return data
  },

  getResourceType: async (id: string): Promise<ResourceType> => {
    const { data } = await axiosInstance.get(`/resource-type/${id}`)
    return data
  },

  createResourceType: async (payload: ResourceTypeFormValues): Promise<ResourceType> => {
    const { data } = await axiosInstance.post('/resource-type', payload)
    return data
  },

  updateResourceType: async (
    id: string,
    payload: ResourceTypeFormValues
  ): Promise<ResourceType> => {
    const { data } = await axiosInstance.patch(`/resource-type/${id}`, { id, ...payload })
    return data
  },

  deleteResourceType: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/resource-type/${id}`)
  },
}
