import type {
  ChangeRequest,
  ChangeRequestFormValues,
  PaginatedResponse,
  ChangeRequestQueryParams,
} from '@/../types/change-request/change-request.types'
import { axiosInstance } from '@/services/base.axios'

export const changeRequestService = {
  async getChangeRequests(params: ChangeRequestQueryParams): Promise<PaginatedResponse<ChangeRequest>> {
    try {
      const { data } = await axiosInstance.get('/change-request', { params })
      return data
    } catch (error) {
      console.error('Failed to fetch change requests:', error)
      throw new Error('Could not fetch change requests.')
    }
  },

  async getChangeRequest(id: string): Promise<ChangeRequest> {
    try {
      const { data } = await axiosInstance.get(`/change-request/${id}`)
      return data
    } catch (error) {
      console.error(`Failed to fetch change request with id ${id}:`, error)
      throw new Error('Change request not found.')
    }
  },

  async createChangeRequest(payload: ChangeRequestFormValues): Promise<ChangeRequest> {
    try {
      const { data } = await axiosInstance.post('/change-request', payload)
      return data
    } catch (error) {
      console.error('Failed to create change request:', error)
      throw error
    }
  },

  async updateChangeRequest(
    id: string,
    payload: Partial<ChangeRequestFormValues>
  ): Promise<ChangeRequest> {
    try {
      const { data } = await axiosInstance.patch(`/change-request/${id}`, payload)
      return data
    } catch (error) {
      console.error(`Failed to update change request with id ${id}:`, error)
      throw new Error('Update failed. Change request might not exist.')
    }
  },

  async deleteChangeRequest(id: string): Promise<{ message: string }> {
    try {
      const { data } = await axiosInstance.delete(`/change-request/${id}`)
      return data
    } catch (error) {
      console.error(`Failed to delete change request with id ${id}:`, error)
      throw new Error('Delete failed.')
    }
  },
}
