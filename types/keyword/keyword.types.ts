export interface Keyword {
  id: string
  value: string
  createdAt?: string
  updatedAt?: string
}

export interface KeywordFormValues {
  value: string
}

export interface PaginatedResponse<T> {
  count: number
  pageNumber: number
  pageSize: number
  pageCount: number
  data: T[]
}

export interface KeywordFormProps {
  onSubmitFunction: (data: KeywordFormValues) => void
  initialData?: Keyword
}

export interface KeywordDeleteDialogType {
  open: boolean
  close: () => void
  onDelete: (id: string) => void
  id: string
}
