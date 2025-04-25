import { axiosInstance } from './base.axios'
import { PaginatedDocumentsResponse } from '../../types/documents/document.types'

export const documentService = {
  getDocuments: (pageNumber = 1, pageSize = 10) =>
    axiosInstance
      .get<PaginatedDocumentsResponse>('/document', {
        params: { pageNumber, pageSize },
      })
      .then((res) => res.data),

  deleteDocument: (id: string) => {
    console.log(id)
    axiosInstance.delete(`/document/${id}`).then((res) => res.data)
  },

  uploadDocument: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return axiosInstance
      .post<Document>('/document/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data)
  },
}
