export interface Collection {
  id: string
  title: string
  resourceCount: number
  description: string
  coverImage: {
    id: string
    url: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface CollectionFormValues {
  title: string
  description: string
  coverImage: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  pageNumber: number
  pageCount: number
  pageSize: number
}

export interface CollectionsQueryParams {
  pageNumber?: number
  pageSize?: number
  search?: string
}

export interface CollectionFormProps {
  onSubmitFunction: (data: CollectionFormValues) => void
  initialData?: Collection
}

export interface CollectionsDeleteDialogType {
  close: () => void
  onDelete: (id: string) => void
  id: string
}
