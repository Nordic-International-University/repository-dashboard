import { axiosInstance } from '@/services/base.axios'
import { Keyword, KeywordFormValues, PaginatedResponse } from '../../types/keyword/keyword.types'

export const keywordService = {
  getAll: async (
    pageNumber: number,
    pageSize: number,
    search?: string
  ): Promise<PaginatedResponse<Keyword>> => {
    const { data } = await axiosInstance.get('/keyword', {
      params: { pageNumber, pageSize, search },
    })
    return data
  },

  create: async (payload: KeywordFormValues): Promise<Keyword> => {
    const { data } = await axiosInstance.post('/keyword', payload)
    return data
  },

  update: async (id: string, payload: KeywordFormValues): Promise<Keyword> => {
    const { data } = await axiosInstance.patch(`/keyword/${id}`, { id, ...payload })
    return data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/keyword/${id}`)
  },
}
