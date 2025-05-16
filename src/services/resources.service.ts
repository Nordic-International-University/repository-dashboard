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
    try {
      const { data } = await axiosInstance.get('/resource-type', {
        params: { pageNumber, pageSize, search },
      })
      return data
    } catch (error) {
      console.error('Failed to fetch resource types:', error)
      throw error
    }
  },

  getResourceType: async (id: string): Promise<ResourceType> => {
    try {
      const { data } = await axiosInstance.get(`/resource-type/${id}`)
      return data
    } catch (error) {
      console.error(`Failed to fetch resource type with id ${id}:`, error)
      throw error
    }
  },

  createResourceType: async (payload: ResourceTypeFormValues): Promise<ResourceType> => {
    try {
      const { data } = await axiosInstance.post('/resource-type', payload)
      return data
    } catch (error) {
      console.error('Failed to create resource type:', error)
      throw error
    }
  },

  updateResourceType: async (
    id: string,
    payload: ResourceTypeFormValues
  ): Promise<ResourceType> => {
    try {
      const { data } = await axiosInstance.patch(`/resource-type/${id}`, {
        id,
        ...payload,
      })
      return data
    } catch (error) {
      console.error(`Failed to update resource type with id ${id}:`, error)
      throw error
    }
  },

  deleteResourceType: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/resource-type/${id}`)
    } catch (error) {
      console.error(`Failed to delete resource type with id ${id}:`, error)
      throw error
    }
  },
}
