export interface ResourceType {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  count: number
  pageNumber: number
  pageSize: number
  pageCount: number
  data: T[]
}

export interface ResourceTypeFormValues {
  name: string
}

export interface ResourceTypeFormProps {
  onSubmitFunction: (data: ResourceTypeFormValues) => void
  initialData?: ResourceType
}

export interface ResourceTypeDeleteDialogType {
  open: boolean
  close: () => void
  onDelete: (id: string) => void
  id: string
}
