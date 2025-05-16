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
    search = '',
    filters: Record<string, any> = {}
  ): Promise<PaginatedResourceResponse> {
    try {
      const params = new URLSearchParams()

      params.append('pageNumber', String(pageNumber))
      params.append('pageSize', String(pageSize))
      params.append('search', search)

      for (const [key, value] of Object.entries(filters)) {
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          continue
        }

        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v) params.append(key, v)
          })
        } else {
          params.append(key, String(value))
        }
      }

      const response = await axiosInstance.get<PaginatedResourceResponse>(
        `/resource/admin?${params.toString()}`
      )

      return response.data
    } catch (error: any) {
      console.error('Failed to fetch resources:', error)
      if (error?.response?.data?.message === 'Insufficient permissions') {
        const customError = new Error('Bu amal uchun sizda ruxsat yo\'q')
        customError.name = 'PermissionError'
        throw customError
      }
      throw error
    }
  },
  async getResource(id: string): Promise<SingleResource> {
    try {
      const response = await axiosInstance.get<SingleResource>(`/resource/admin/${id}`)
      return response.data
    } catch (error: any) {
      console.error(`Failed to fetch resource with id ${id}:`, error)
      if (error?.response?.data?.message === 'Insufficient permissions') {
        const customError = new Error('Bu amal uchun sizda ruxsat yo\'q')
        customError.name = 'PermissionError'
        throw customError
      }
      throw error
    }
  },

  async createResource(data: ResourceFormValues): Promise<Resource> {
    try {
      const response = await axiosInstance.post<Resource>('/resource', data)
      return response.data
    } catch (error: any) {
      console.error('Failed to create resource:', error)
      if (error?.response?.data?.message === 'Insufficient permissions') {
        const customError = new Error('Bu amal uchun sizda ruxsat yo\'q')
        customError.name = 'PermissionError'
        throw customError
      }
      throw error
    }
  },

  async updateResource(id: string, data: ResourceFormValues | any): Promise<Resource> {
    try {
      const response = await axiosInstance.patch<Resource>(`/resource/${id}`, data)
      return response.data
    } catch (error: any) {
      console.error(`Failed to update resource with id ${id}:`, error)
      if (error?.response?.data?.message === 'Insufficient permissions') {
        const customError = new Error('Bu amal uchun sizda ruxsat yo\'q')
        customError.name = 'PermissionError'
        throw customError
      }
      throw error
    }
  },

  async deleteResource(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/resource/${id}`)
    } catch (error: any) {
      console.error(`Failed to delete resource with id ${id}:`, error)
      if (error?.response?.data?.message === 'Insufficient permissions') {
        const customError = new Error('Bu amal uchun sizda ruxsat yo\'q')
        customError.name = 'PermissionError'
        throw customError
      }
      throw error
    }
  },
}
