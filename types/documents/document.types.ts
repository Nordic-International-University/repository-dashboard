export interface Document {
  id: string
  filename: string
  mimetype: string
  size: number
  url: string
}

export interface PaginatedDocumentsResponse {
  data: Document[]
  pageNumber: number
  pageSize: number
  pageCount: number
  count: number
}
