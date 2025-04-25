import { axiosInstance } from '@/services/base.axios'
import {
  PaginatedResourceResponse,
  Resource,
  ResourceFormValues,
  SingleResource,
} from '../../types/material/material.types'

export const resourceService = {
  async getResources(
    pageNumber = 1,
    pageSize = 10,
    search = ''
  ): Promise<PaginatedResourceResponse> {
    try {
      const response = await axiosInstance.get<PaginatedResourceResponse>(
        '/resource?withDocuments=true',
        {
          params: { pageNumber, pageSize, search },
        }
      )
      return response.data
    } catch (error) {
      console.error('Failed to fetch resources:', error)
      throw error
    }
  },

  async getResource(id: string): Promise<SingleResource> {
    try {
      const response = await axiosInstance.get<SingleResource>(`/resource/${id}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch resource with id ${id}:`, error)
      throw error
    }
  },

  async createResource(data: ResourceFormValues): Promise<Resource> {
    try {
      const response = await axiosInstance.post<Resource>('/resource', data)
      return response.data
    } catch (error) {
      console.error('Failed to create resource:', error)
      throw error
    }
  },

  async updateResource(id: string, data: ResourceFormValues): Promise<Resource> {
    console.log(data)
    try {
      const response = await axiosInstance.patch<Resource>(`/resource/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Failed to update resource with id ${id}:`, error)
      throw error
    }
  },

  async deleteResource(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/resource/${id}`)
    } catch (error) {
      console.error(`Failed to delete resource with id ${id}:`, error)
      throw error
    }
  },
}
