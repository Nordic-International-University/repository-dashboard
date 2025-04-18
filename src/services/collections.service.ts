import type {
  Collection,
  CollectionFormValues,
  PaginatedResponse,
  CollectionsQueryParams,
} from '@/../types/colecctions/collections.types'
import { axiosInstance } from '@/services/base.axios'

export const collectionsService = {
  async getCollections(params: CollectionsQueryParams): Promise<PaginatedResponse<Collection>> {
    try {
      const { data } = await axiosInstance.get('/collection', { params })
      return data
    } catch (error) {
      console.error('Failed to fetch collections:', error)
      throw new Error('Could not fetch collections.')
    }
  },

  async getCollection(id: string): Promise<Collection> {
    try {
      const { data } = await axiosInstance.get(`/collection/${id}`)
      return data
    } catch (error) {
      console.error(`Failed to fetch collection with id ${id}:`, error)
      throw new Error('Collection not found.')
    }
  },

  async createCollection(payload: CollectionFormValues): Promise<Collection> {
    try {
      const { data } = await axiosInstance.post('/collection', payload)
      return data
    } catch (error) {
      console.error('Failed to create collection:', error)
      throw new Error('Failed to create collection. Check input data or duplicates.')
    }
  },

  async updateCollection(id: string, payload: Partial<CollectionFormValues>): Promise<Collection> {
    try {
      const { data } = await axiosInstance.patch(`/collection/${id}`, payload)
      return data
    } catch (error) {
      console.error(`Failed to update collection with id ${id}:`, error)
      throw new Error('Update failed. Collection might not exist.')
    }
  },

  async deleteCollection(id: string): Promise<{ message: string }> {
    try {
      const { data } = await axiosInstance.delete(`/collection/${id}`)
      return data
    } catch (error) {
      console.error(`Failed to delete collection with id ${id}:`, error)
      throw new Error('Delete failed. Collection might contain active resources.')
    }
  },
}
