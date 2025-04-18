export interface Subject {
  category: any
  id: string
  name: string
  categoryId: string
  createdAt: string
  updatedAt: string
}

export interface SubjectFormValues {
  name: string
  categoryId: string
}

export interface PaginatedResponse<T> {
  count: number
  pageNumber: number
  pageSize: number
  pageCount: number
  data: T[]
}

export interface SubjectFormProps {
  onSubmitFunction: (data: SubjectFormValues) => void
  initialData?: Subject
}

export interface SubjectDeleteDialogType {
  open: boolean
  close: () => void
  onDelete: (id: string) => void
  id: string
}
