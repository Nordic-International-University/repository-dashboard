import { Author, AuthorFormValues } from '../../types/author/author.types'
import { PaginatedResponse } from '../../types/keyword/keyword.types'
import axiosInstance from '@/services/base.axios'

export const authorService = {
  getAuthors: async (pageNumber: number, pageSize: number, search?: string) => {
    const { data } = await axiosInstance.get<PaginatedResponse<Author>>('/author', {
      params: { pageNumber, pageSize, search },
    })
    return data
  },

  getAuthor: async (id: string) => {
    const { data } = await axiosInstance.get<Author>(`/author/${id}`)
    return data
  },

  createAuthor: async (payload: AuthorFormValues) => {
    const { data } = await axiosInstance.post<Author>('/author', payload)
    return data
  },

  updateAuthor: async (id: string, payload: AuthorFormValues) => {
    const { data } = await axiosInstance.patch<Author>(`/author/${id}`, payload)
    return data
  },

  deleteAuthor: async (id: string) => {
    const { data } = await axiosInstance.delete(`/author/${id}`)
    return data
  },
}
