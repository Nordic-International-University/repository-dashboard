import { axiosInstance } from '@/services/base.axios'
import {
  PaginatedResponse,
  Subject,
  SubjectFormValues,
} from '../../types/subject-types/subject.types'

export const subjectService = {
  getSubjects: async (
    pageNumber: number,
    pageSize: number,
    search?: string,
    categoryId?: string
  ): Promise<PaginatedResponse<Subject>> => {
    const { data } = await axiosInstance.get('/subject', {
      params: {
        pageNumber,
        pageSize,
        search,
        categoryId,
      },
    })
    return data
  },

  getSubjectById: async (id: string): Promise<Subject> => {
    const { data } = await axiosInstance.get(`/subject/${id}`)
    return data
  },

  createSubject: async (payload: SubjectFormValues): Promise<Subject> => {
    const { data } = await axiosInstance.post('/subject', payload)
    return data
  },

  updateSubject: async (id: string, payload: SubjectFormValues): Promise<Subject> => {
    const { data } = await axiosInstance.patch(`/subject/${id}`, payload)
    return data
  },

  deleteSubject: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/subject/${id}`)
  },
}
